import { chromium } from "playwright";
import fs from "node:fs";

const baseUrl = process.env.EMBIR_BASE_URL || "https://embir.xyz";
const chromiumPath = process.env.CHROMIUM_PATH || "/snap/bin/chromium";

const pages = [
  { label: "home", url: `${baseUrl}/` },
  { label: "register", url: `${baseUrl}/auth/register` },
  { label: "us-product", url: `${baseUrl}/en/us/free-dating-app` },
  { label: "uk-product", url: `${baseUrl}/en/uk/free-dating-app` },
  { label: "fr-product", url: `${baseUrl}/fr/gratuit-au-lancement` },
  { label: "comparison", url: `${baseUrl}/en/comparison/grindr-vs-embir` },
  { label: "city-fr", url: `${baseUrl}/fr/rencontre/paris` },
  { label: "city-us", url: `${baseUrl}/en/us/dating/new-york` },
  { label: "city-uk", url: `${baseUrl}/en/uk/london` },
  { label: "guide", url: `${baseUrl}/en/guides/choose-a-dating-platform` },
  { label: "article", url: `${baseUrl}/en/blog/best-free-gay-dating-apps-2026` },
];

const viewports = [
  { label: "desktop", width: 1440, height: 1000 },
  { label: "mobile", width: 390, height: 844 },
];

const screenshotTargets = new Set([
  "home:desktop",
  "home:mobile",
  "register:mobile",
  "us-product:mobile",
  "uk-product:mobile",
  "fr-product:mobile",
]);

function sanitizeMessage(message) {
  return String(message || "")
    .replace(/\s+/g, " ")
    .slice(0, 300);
}

async function runPage(browser, target, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.label === "mobile" ? 2 : 1,
    isMobile: viewport.label === "mobile",
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const networkErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(sanitizeMessage(message.text()));
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(sanitizeMessage(error.message));
  });
  page.on("requestfailed", (request) => {
    networkErrors.push(
      sanitizeMessage(`${request.failure()?.errorText || "failed"} ${request.url()}`),
    );
  });

  const startedAt = Date.now();
  let response;
  let status = 0;
  let finalUrl = target.url;
  let loadError = "";

  try {
    response = await page.goto(target.url, { waitUntil: "load", timeout: 45000 });
    status = response?.status() || 0;
    finalUrl = page.url();
    await page.waitForTimeout(500);
  } catch (error) {
    loadError = sanitizeMessage(error.message);
  }

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const totals = resources.reduce(
      (acc, item) => {
        const name = item.name || "";
        const bytes = item.transferSize || item.encodedBodySize || 0;
        acc.requests += 1;
        acc.bytes += bytes;
        if (name.includes("/_next/static/") && name.endsWith(".js")) {
          acc.jsBytes += bytes;
        }
        if (name.endsWith(".css")) {
          acc.cssBytes += bytes;
        }
        if (/\.(png|jpe?g|webp|gif|svg|ico)(\?|$)/i.test(name)) {
          acc.imageBytes += bytes;
        }
        return acc;
      },
      { requests: 0, bytes: 0, jsBytes: 0, cssBytes: 0, imageBytes: 0 },
    );

    const doc = document.documentElement;
    const body = document.body;
    const viewportWidth = window.innerWidth;
    const overflowing = Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 1 && (rect.left < -1 || rect.right > viewportWidth + 1);
      })
      .slice(0, 5)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: String(element.className || "").slice(0, 120),
        text: String(element.textContent || "").replace(/\s+/g, " ").slice(0, 120),
        right: Math.round(element.getBoundingClientRect().right),
      }));

    return {
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
      load: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
      transferSize: nav ? nav.transferSize || nav.encodedBodySize || 0 : 0,
      totalPageBytes: totals.bytes,
      jsBytes: totals.jsBytes,
      cssBytes: totals.cssBytes,
      imageBytes: totals.imageBytes,
      requestCount: totals.requests,
      scrollWidth: Math.max(doc.scrollWidth, body?.scrollWidth || 0),
      clientWidth: doc.clientWidth,
      overflowCount: overflowing.length,
      overflowing,
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() || "",
      ctaVisible: Array.from(document.querySelectorAll("a,button")).some((item) =>
        /Join the founding community|Create account|Sign up|Rejoindre|Inscription/i.test(
          item.textContent || "",
        ),
      ),
      registerEmailVisible: !!document.querySelector(
        'input[type="email"], input[name*="email" i]',
      ),
      registerPasswordVisible: !!document.querySelector(
        'input[type="password"], input[name*="password" i]',
      ),
      registerSubmitVisible: Array.from(document.querySelectorAll("button")).some((item) =>
        /Create|Register|Sign up|Join|Rejoindre|Créer/i.test(item.textContent || ""),
      ),
    };
  }).catch((error) => ({
    domContentLoaded: null,
    load: null,
    transferSize: 0,
    totalPageBytes: 0,
    jsBytes: 0,
    cssBytes: 0,
    imageBytes: 0,
    requestCount: 0,
    scrollWidth: 0,
    clientWidth: viewport.width,
    overflowCount: 0,
    overflowing: [],
    h1: "",
    ctaVisible: false,
    registerEmailVisible: false,
    registerPasswordVisible: false,
    registerSubmitVisible: false,
    evaluateError: sanitizeMessage(error.message),
  }));

  const key = `${target.label}:${viewport.label}`;
  let screenshot = "";
  if (screenshotTargets.has(key)) {
    screenshot = `/tmp/embir_debug_${target.label}_${viewport.label}.png`;
    await page.screenshot({ path: screenshot, fullPage: false }).catch(() => {});
  }

  await context.close();

  const criticalErrors = consoleErrors
    .concat(pageErrors)
    .filter((message) => !/favicon|manifest\.json/i.test(message));
  const badStatus = status < 200 || status >= 400;
  const mobileOverflow = viewport.label === "mobile" && metrics.scrollWidth > metrics.clientWidth + 1;
  const verdict =
    !loadError &&
    !badStatus &&
    criticalErrors.length === 0 &&
    networkErrors.length === 0 &&
    !mobileOverflow
      ? "OK"
      : "CHECK";

  return {
    page: target.label,
    viewport: viewport.label,
    url: target.url,
    finalUrl,
    status,
    elapsedMs: Date.now() - startedAt,
    consoleErrors: criticalErrors,
    networkErrors,
    loadError,
    verdict,
    screenshot,
    ...metrics,
  };
}

const browser = await chromium.launch({
  executablePath: chromiumPath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];
for (const target of pages) {
  for (const viewport of viewports) {
    results.push(await runPage(browser, target, viewport));
  }
}
await browser.close();

const outputPath = "/tmp/embir_qa_performance_results.json";
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log("Page | Viewport | Status | Console errors | Network errors | DCL | Load | JS KB | CSS KB | Images KB | Requests | Mobile overflow | Verdict");
for (const result of results) {
  console.log(
    [
      result.page,
      result.viewport,
      result.status,
      result.consoleErrors.length,
      result.networkErrors.length,
      result.domContentLoaded ?? "n/a",
      result.load ?? "n/a",
      Math.round((result.jsBytes || 0) / 1024),
      Math.round((result.cssBytes || 0) / 1024),
      Math.round((result.imageBytes || 0) / 1024),
      result.requestCount,
      result.viewport === "mobile" ? `${result.scrollWidth}/${result.clientWidth}` : "-",
      result.verdict,
    ].join(" | "),
  );
}
console.log(`JSON: ${outputPath}`);

const failures = results.filter((result) => result.verdict !== "OK");
if (failures.length > 0) {
  console.log(`Failures: ${failures.length}`);
  for (const failure of failures) {
    console.log(
      `${failure.page}/${failure.viewport}: ${failure.loadError || failure.consoleErrors[0] || failure.networkErrors[0] || "needs review"}`,
    );
  }
  process.exitCode = 1;
}
