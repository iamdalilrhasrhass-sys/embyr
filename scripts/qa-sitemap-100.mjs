const SITEMAP_URL = "https://embir.xyz/sitemap.xml";
const DEFAULT_SAMPLE_SIZE = 100;
const CONCURRENCY = 10;

export function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) =>
      match[1]
        .replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">"),
    )
    .filter((url) => url.startsWith("https://embir.xyz/"));
}

export function selectDeterministicSample(urls, requestedSize = DEFAULT_SAMPLE_SIZE) {
  if (urls.length <= requestedSize) return [...urls];
  if (requestedSize <= 1) return [urls[0]];

  const selected = [];
  const lastIndex = urls.length - 1;
  for (let index = 0; index < requestedSize; index++) {
    selected.push(urls[Math.round((index * lastIndex) / (requestedSize - 1))]);
  }
  return [...new Set(selected)];
}

function extractCanonical(html) {
  const match = html.match(
    /<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]+href=["']([^"']+)["']/i,
  ) ?? html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*canonical[^"']*["']/i,
  );
  return match?.[1] ?? null;
}

function hasNoindex(html, headers) {
  const robotsHeader = headers.get("x-robots-tag") ?? "";
  const robotsMeta = [
    ...html.matchAll(
      /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/gi,
    ),
    ...html.matchAll(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/gi,
    ),
  ].map((match) => match[1]).join(",");
  return /\bnoindex\b/i.test(`${robotsHeader},${robotsMeta}`);
}

async function inspectUrl(url) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "Embir-QA/2026-06-24" },
      signal: AbortSignal.timeout(15_000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    const html = contentType.includes("text/html")
      ? (await response.text()).slice(0, 1_500_000)
      : "";

    return {
      url,
      status: response.status,
      redirect: response.headers.get("location"),
      canonical: html ? extractCanonical(html) : null,
      noindex: html ? hasNoindex(html, response.headers) : false,
      contentType,
      durationMs: Date.now() - startedAt,
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: 0,
      redirect: null,
      canonical: null,
      noindex: false,
      contentType: "",
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapWithConcurrency(items, worker, concurrency = CONCURRENCY) {
  const results = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  );
  return results;
}

async function main() {
  const sitemapResponse = await fetch(SITEMAP_URL, {
    headers: { "user-agent": "Embir-QA/2026-06-24" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!sitemapResponse.ok) {
    throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}`);
  }

  const urls = extractSitemapUrls(await sitemapResponse.text());
  const sample = selectDeterministicSample(urls, DEFAULT_SAMPLE_SIZE);
  const results = await mapWithConcurrency(sample, inspectUrl);
  const statusCounts = {};
  for (const result of results) {
    const key = String(result.status);
    statusCounts[key] = (statusCounts[key] ?? 0) + 1;
  }

  const failures = results.filter(
    (result) =>
      result.status !== 200 ||
      result.noindex ||
      (result.canonical && result.canonical !== result.url),
  );

  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    sitemapUrl: SITEMAP_URL,
    totalUrls: urls.length,
    sampledUrls: sample.length,
    statusCounts,
    noindexCount: results.filter((result) => result.noindex).length,
    canonicalMismatchCount: results.filter(
      (result) => result.canonical && result.canonical !== result.url,
    ).length,
    failures,
    results,
  }, null, 2));

  if (results.some((result) => result.status >= 400 || result.status === 0)) {
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1]
  ? new URL(`file://${process.argv[1]}`).href
  : "";
if (import.meta.url === invokedPath) {
  await main();
}
