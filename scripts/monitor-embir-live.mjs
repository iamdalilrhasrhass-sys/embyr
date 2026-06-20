import https from "node:https";
import http from "node:http";

const baseUrl = process.env.EMBIR_BASE_URL || "https://embir.xyz";
const maxRedirects = 5;
const limits = {
  pageTtfbMs: Number(process.env.EMBIR_MONITOR_PAGE_TTFB_MS || 2000),
  pageTotalMs: Number(process.env.EMBIR_MONITOR_PAGE_TOTAL_MS || 5000),
  sitemapTtfbMs: Number(process.env.EMBIR_MONITOR_SITEMAP_TTFB_MS || 3000),
  sitemapTotalMs: Number(process.env.EMBIR_MONITOR_SITEMAP_TOTAL_MS || 6000),
};

const forbiddenHomepageText = [
  "Gay Dating App",
  "designed for Paris",
  "Grindr vs Embir",
  "real guys",
  "Where glances ignite",
  "Where every look ignites",
];

const pageChecks = [
  { label: "home", path: "/", expectH1: true },
  { label: "register", path: "/auth/register" },
  { label: "us", path: "/en/us/free-dating-app" },
  { label: "uk", path: "/en/uk/free-dating-app" },
  { label: "fr", path: "/fr/gratuit-au-lancement" },
];

function requestUrl(rawUrl, redirects = 0) {
  const startedAt = Date.now();
  let firstByteAt = 0;

  return new Promise((resolve, reject) => {
    const url = new URL(rawUrl);
    const client = url.protocol === "http:" ? http : https;
    const req = client.request(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent": "embir-live-monitor/1.0",
          "Accept": "text/html,application/xml,text/plain;q=0.9,*/*;q=0.8",
        },
      },
      (res) => {
        firstByteAt = Date.now();
        const status = res.statusCode || 0;
        const location = res.headers.location;
        if (status >= 300 && status < 400 && location && redirects < maxRedirects) {
          res.resume();
          const nextUrl = new URL(location, url).toString();
          resolve(requestUrl(nextUrl, redirects + 1));
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve({
            url: rawUrl,
            finalUrl: url.toString(),
            status,
            headers: res.headers,
            body,
            size: Buffer.byteLength(body),
            ttfbMs: firstByteAt - startedAt,
            totalMs: Date.now() - startedAt,
          });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error(`timeout ${rawUrl}`));
    });
    req.end();
  });
}

function hasCanonical(html) {
  return /rel=["']canonical["']/i.test(html) || /rel=canonical/i.test(html);
}

function hasNoindex(html) {
  return /noindex/i.test(html);
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

const failures = [];
const rows = [];

for (const check of pageChecks) {
  const result = await requestUrl(`${baseUrl}${check.path}`);
  const label = check.label.toUpperCase();
  const ttfbLimit = limits.pageTtfbMs;
  const totalLimit = limits.pageTotalMs;
  const canonical = hasCanonical(result.body);
  const noindex = hasNoindex(result.body);

  assert(result.status === 200, `${label}: HTTP ${result.status}`, failures);
  assert(canonical, `${label}: canonical missing`, failures);
  assert(!noindex, `${label}: unexpected noindex`, failures);
  assert(result.ttfbMs <= ttfbLimit, `${label}: TTFB ${result.ttfbMs}ms > ${ttfbLimit}ms`, failures);
  assert(result.totalMs <= totalLimit, `${label}: total ${result.totalMs}ms > ${totalLimit}ms`, failures);

  if (check.expectH1) {
    assert(
      result.body.includes("Free Inclusive Dating App for Every Orientation"),
      "HOME: missing exact H1",
      failures,
    );
    for (const text of forbiddenHomepageText) {
      assert(!result.body.includes(text), `HOME: forbidden text present: ${text}`, failures);
    }
  }

  rows.push({
    label: check.label,
    status: result.status,
    ttfbMs: result.ttfbMs,
    totalMs: result.totalMs,
    size: result.size,
    canonical,
    noindex,
  });
}

const robots = await requestUrl(`${baseUrl}/robots.txt`);
assert(robots.status === 200, `ROBOTS: HTTP ${robots.status}`, failures);
rows.push({
  label: "robots",
  status: robots.status,
  ttfbMs: robots.ttfbMs,
  totalMs: robots.totalMs,
  size: robots.size,
  canonical: "n/a",
  noindex: "n/a",
});

const sitemap = await requestUrl(`${baseUrl}/sitemap.xml`);
const locCount = (sitemap.body.match(/<loc>/g) || []).length;
assert(sitemap.status === 200, `SITEMAP: HTTP ${sitemap.status}`, failures);
assert(locCount >= 1500, `SITEMAP: ${locCount} URLs < 1500`, failures);
assert(
  sitemap.ttfbMs <= limits.sitemapTtfbMs,
  `SITEMAP: TTFB ${sitemap.ttfbMs}ms > ${limits.sitemapTtfbMs}ms`,
  failures,
);
assert(
  sitemap.totalMs <= limits.sitemapTotalMs,
  `SITEMAP: total ${sitemap.totalMs}ms > ${limits.sitemapTotalMs}ms`,
  failures,
);
rows.push({
  label: "sitemap",
  status: sitemap.status,
  ttfbMs: sitemap.ttfbMs,
  totalMs: sitemap.totalMs,
  size: sitemap.size,
  locCount,
  canonical: "n/a",
  noindex: "n/a",
});

console.log("Label | HTTP | TTFB ms | Total ms | Size | Canonical | Noindex | Extra");
for (const row of rows) {
  console.log(
    [
      row.label,
      row.status,
      row.ttfbMs,
      row.totalMs,
      row.size,
      row.canonical,
      row.noindex,
      row.locCount ? `loc:${row.locCount}` : "",
    ].join(" | "),
  );
}

if (failures.length > 0) {
  console.error("MONITOR FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("MONITOR OK");
