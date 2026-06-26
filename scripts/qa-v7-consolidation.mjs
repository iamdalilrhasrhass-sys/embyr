import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const baseUrl = process.env.V7_BASE_URL || process.env.LANDING_BASE_URL || "http://127.0.0.1:3200";
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const evidenceDir = path.resolve("docs/superpowers/evidence/v7-consolidation");
const reportPath = path.join(evidenceDir, "qa-report.json");

const intentSlugs = ["amour", "amis", "fun", "plan-cul", "sport", "evenements"];
const pilotCities = [
  "paris",
  "lyon",
  "marseille",
  "toulouse",
  "bordeaux",
  "lille",
  "nantes",
  "nice",
  "strasbourg",
  "montpellier",
  "rennes",
  "grenoble",
];

const checks = [];

function addCheck(name, pass, details = {}) {
  checks.push({
    name,
    pass: Boolean(pass),
    details,
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickButtonByText(page, text) {
  await page.evaluate((wantedText) => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (candidate) => candidate.textContent?.replace(/\s+/g, " ").trim() === wantedText,
    );
    if (!button) {
      throw new Error(`Button not found: ${wantedText}`);
    }
    button.click();
  }, text);
}

async function preparePage(browser, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  return { page, consoleErrors, pageErrors };
}

async function dismissCookieBanner(page) {
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll("button")).find((candidate) =>
      /Essential only|Tout refuser|Essentiel/i.test(candidate.textContent || ""),
    );
    button?.click();
  });
}

async function touchDrag(page, selector, deltaX, deltaY) {
  await page.$eval(selector, (element) => element.scrollIntoView({ block: "center", inline: "center" }));
  await delay(150);
  let element = null;
  let box = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    element = await page.$(selector);
    box = element ? await element.boundingBox() : null;
    if (box && box.width > 0 && box.height > 0) break;
    await delay(100);
  }
  if (!element) throw new Error(`Missing draggable selector: ${selector}`);
  if (!box) throw new Error(`Missing bounding box: ${selector}`);
  const startX = Math.round(box.x + box.width / 2);
  const startY = Math.round(box.y + box.height / 2);
  const client = await page.target().createCDPSession();
  const point = (x, y) => ({ x, y, radiusX: 6, radiusY: 6, force: 1 });

  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point(startX, startY)],
  });
  await delay(100);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [point(startX + deltaX, startY + deltaY)],
  });
  await delay(160);
  const during = await page.$eval(selector, (node) => ({
    dragging: node.getAttribute("data-dragging"),
    tiltX: node.style.getPropertyValue("--tilt-x"),
    tiltY: node.style.getPropertyValue("--tilt-y"),
    transform: node.querySelector("g")?.style.transform || "",
  }));
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await delay(160);
  const after = await page.$eval(selector, (node) => ({
    dragging: node.getAttribute("data-dragging"),
    tiltX: node.style.getPropertyValue("--tilt-x"),
    tiltY: node.style.getPropertyValue("--tilt-y"),
    transform: node.querySelector("g")?.style.transform || "",
  }));
  await client.detach();
  return { during, after };
}

async function checkLanding(browser, locale, urlPath, expectedH1, expectedHeroHref) {
  const { page, consoleErrors, pageErrors } = await preparePage(browser, {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const response = await page.goto(`${baseUrl}${urlPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await page.waitForSelector(".embir2100 h1", { timeout: 20_000 });
  await dismissCookieBanner(page);

  const initial = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() || "",
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      heroHref: document.querySelector(".e21-hero .e21-button--primary")?.getAttribute("href") || "",
      compassExists: Boolean(document.querySelector(".e21-compass")),
      universeExists: Boolean(document.querySelector(".e21-universe__object")),
    };
  });

  const compassDrag = await touchDrag(page, ".e21-compass", 70, -24);
  const universeDrag = await touchDrag(page, ".e21-universe__object", 64, 34);

  addCheck(`landing ${locale} mobile responds`, response?.status() === 200, { status: response?.status() || 0 });
  addCheck(`landing ${locale} h1`, initial.h1 === expectedH1, { actual: initial.h1, expected: expectedH1 });
  addCheck(`landing ${locale} no horizontal overflow`, initial.scrollWidth <= initial.clientWidth + 1, initial);
  addCheck(`landing ${locale} hero routes to discovery`, initial.heroHref === expectedHeroHref, initial);
  addCheck(`landing ${locale} compass touch drag`, initial.compassExists && /rotateZ/.test(compassDrag.during.transform), compassDrag);
  addCheck(
    `landing ${locale} universe touch drag`,
    initial.universeExists &&
      universeDrag.during.dragging === "true" &&
      /deg/.test(universeDrag.during.tiltX) &&
      universeDrag.after.dragging === "false",
    universeDrag,
  );
  addCheck(`landing ${locale} no console/page errors`, consoleErrors.length === 0 && pageErrors.length === 0, {
    consoleErrors,
    pageErrors,
  });

  await page.close();
}

async function checkDiscoveryScenario(browser, scenario) {
  const { page, consoleErrors, pageErrors } = await preparePage(browser, {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const requestedUrls = [];
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.url().includes("/api/discovery-preview")) {
      requestedUrls.push(request.url());
      request.respond({
        status: scenario.httpStatus,
        contentType: "application/json",
        body: JSON.stringify(scenario.body),
      });
      return;
    }
    request.continue();
  });

  const response = await page.goto(`${baseUrl}/fr/decouvrir?intent=AMOUR&city=Paris`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await page.waitForSelector(".discovery__form", { timeout: 20_000 });
  await clickButtonByText(page, "Un homme");
  await clickButtonByText(page, "Des femmes");
  await clickButtonByText(page, "Amour");
  await page.waitForSelector("button.discovery__submit:not(:disabled)", { timeout: 10_000 });
  await page.click("button.discovery__submit");
  await page.waitForSelector(scenario.waitSelector, { timeout: 15_000 });

  const state = await page.evaluate(() => ({
    formLoaded: Boolean(document.querySelector(".discovery__form")),
    title: document.querySelector(".discovery__results h2")?.textContent?.trim() || "",
    cardCount: document.querySelectorAll(".discovery__card").length,
    unlockHref: document.querySelector(".discovery__unlock")?.getAttribute("href") || "",
    body: document.body.textContent || "",
  }));
  const relevantConsoleErrors = scenario.ignoreExpected503
    ? consoleErrors.filter((message) => !/status of 503|Service Unavailable/i.test(message))
    : consoleErrors;

  addCheck(`discovery ${scenario.name} page responds`, response?.status() === 200 || state.formLoaded, {
    status: response?.status() || 0,
    formLoaded: state.formLoaded,
    url: page.url(),
  });
  addCheck(`discovery ${scenario.name} requested API`, requestedUrls.length === 1, { requestedUrls });
  addCheck(
    `discovery ${scenario.name} request URL`,
    requestedUrls[0]?.includes("gender=homme") &&
      requestedUrls[0]?.includes("seeking=femme") &&
      requestedUrls[0]?.includes("intent=AMOUR") &&
      requestedUrls[0]?.includes("city=Paris"),
    { requestedUrls },
  );
  addCheck(`discovery ${scenario.name} expected state`, scenario.verify(state), state);
  addCheck(`discovery ${scenario.name} no console/page errors`, relevantConsoleErrors.length === 0 && pageErrors.length === 0, {
    consoleErrors: relevantConsoleErrors,
    pageErrors,
  });

  await page.close();
}

async function checkSeoAndSitemap() {
  const parisResponse = await fetch(`${baseUrl}/fr/rencontre/amour/paris`);
  const parisHtml = await parisResponse.text();
  const chicagoResponse = await fetch(`${baseUrl}/fr/rencontre/amour/chicago`);
  const chicagoHtml = await chicagoResponse.text();
  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemapXml = await sitemapResponse.text();
  const pilotPattern = new RegExp(
    `https://embir\\.xyz/fr/rencontre/(${intentSlugs.join("|")})/(${pilotCities.join("|")})`,
    "g",
  );
  const pilotUrls = new Set(Array.from(sitemapXml.matchAll(pilotPattern)).map((match) => match[0]));

  addCheck("SEO Paris page responds", parisResponse.status === 200, { status: parisResponse.status });
  addCheck("SEO Paris is indexable", !/name=["']robots["'][^>]*noindex/i.test(parisHtml), {
    robots: parisHtml.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || "",
  });
  addCheck("SEO Chicago page responds", chicagoResponse.status === 200, { status: chicagoResponse.status });
  addCheck("SEO Chicago is noindex", /name=["']robots["'][^>]*noindex/i.test(chicagoHtml), {
    robots: chicagoHtml.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || "",
  });
  addCheck("sitemap responds", sitemapResponse.status === 200, { status: sitemapResponse.status });
  addCheck("sitemap contains 72 qualified FR programmatic URLs", pilotUrls.size === 72, {
    count: pilotUrls.size,
  });
  addCheck("sitemap excludes non-qualified Chicago programmatic URL", !sitemapXml.includes("/fr/rencontre/amour/chicago"), {
    containsChicago: sitemapXml.includes("/fr/rencontre/amour/chicago"),
  });
}

await fs.mkdir(evidenceDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  await checkLanding(browser, "fr", "/fr", "Rencontrez ceux qui vous cherchent aussi.", "/fr/decouvrir");
  await checkLanding(browser, "en", "/", "Meet the people who are looking for you too.", "/decouvrir");

  await checkDiscoveryScenario(browser, {
    name: "results",
    httpStatus: 200,
    body: {
      status: "results",
      previews: [
        { ageBand: "25–34", cityLabel: "Paris", intentLabel: "Amour", visualSeed: 42 },
        { ageBand: "35–44", cityLabel: "Paris", intentLabel: "Amour", visualSeed: 77 },
      ],
    },
    waitSelector: ".discovery__card",
    verify: (state) =>
      state.title === "Aperçus compatibles trouvés" &&
      state.cardCount === 2 &&
      state.unlockHref.includes("/fr/auth/register") &&
      state.unlockHref.includes("intent=AMOUR"),
  });
  await checkDiscoveryScenario(browser, {
    name: "empty",
    httpStatus: 200,
    body: { status: "empty", previews: [] },
    waitSelector: ".discovery__state",
    verify: (state) => state.title === "Embir se construit ville par ville." && state.cardCount === 0,
  });
  await checkDiscoveryScenario(browser, {
    name: "unavailable",
    httpStatus: 503,
    body: { status: "unavailable", previews: [] },
    waitSelector: ".discovery__retry",
    ignoreExpected503: true,
    verify: (state) => state.title === "Les aperçus sont temporairement indisponibles." && state.cardCount === 0,
  });

  await checkSeoAndSitemap();
} finally {
  await browser.close();
}

const passed = checks.filter((check) => check.pass).length;
const failed = checks.filter((check) => !check.pass);
const report = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  summary: {
    passed,
    failed: failed.length,
    total: checks.length,
  },
  checks,
};

await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
  if (!check.pass) console.log(`     ${JSON.stringify(check.details)}`);
}
console.log(`Report: ${reportPath}`);

if (failed.length) {
  process.exitCode = 1;
}
