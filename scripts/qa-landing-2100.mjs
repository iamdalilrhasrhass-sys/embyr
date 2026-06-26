import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const baseUrl = process.env.LANDING_BASE_URL || "http://127.0.0.1:3200";
const artifactDir = path.resolve("artifacts/landing-2100");
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const viewports = [
  { label: "desktop-1536", width: 1536, height: 1024 },
  { label: "desktop-1440", width: 1440, height: 900 },
  { label: "mobile-390", width: 390, height: 844 },
  { label: "mobile-320", width: 320, height: 720 },
];

const locales = [
  { label: "fr", path: "/fr", h1: "Rencontrez ceux qui vous cherchent aussi." },
  { label: "en", path: "/", h1: "Meet the people who are looking for you too." },
  { label: "es", path: "/es", h1: "Conoce a quienes también te buscan." },
  { label: "de", path: "/de", h1: "Triff Menschen, die dich ebenfalls suchen." },
  { label: "it", path: "/it", h1: "Incontra chi sta cercando anche te." },
];

const languageHeaders = {
  fr: "fr-FR,fr;q=0.9,en;q=0.7",
  en: "en-US,en;q=0.9",
  es: "es-ES,es;q=0.9,en;q=0.7",
  de: "de-DE,de;q=0.9,en;q=0.7",
  it: "it-IT,it;q=0.9,en;q=0.7",
};

const expectedSportLabel = {
  fr: "Sport",
  en: "Sport",
  es: "Deporte",
  de: "Sport",
  it: "Sport",
};

await fs.mkdir(artifactDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];

async function newIsolatedPage() {
  const context = browser.createBrowserContext
    ? await browser.createBrowserContext()
    : await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.setCacheEnabled(false);
  return { context, page };
}

{
  const { context, page } = await newIsolatedPage();
  await page.setExtraHTTPHeaders({ "Accept-Language": languageHeaders.es });
  const response = await page.goto(`${baseUrl}/`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  const failures = page.url().endsWith("/es")
    ? []
    : [`Expected /es redirect, got ${page.url()}`];
  results.push({
    locale: "geo",
    viewport: "accept-language-es",
    status: response?.status() || 0,
    failures,
    verdict: failures.length === 0 ? "PASS" : "FAIL",
  });
  await context.close();
}

for (const locale of locales) {
  for (const viewport of viewports) {
    const { context, page } = await newIsolatedPage();
    await page.setExtraHTTPHeaders({ "Accept-Language": languageHeaders[locale.label] });
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.width <= 390 ? 2 : 1,
      isMobile: viewport.width <= 390,
    });

    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const qaUrl = new URL(`${baseUrl}${locale.path}`);
    qaUrl.searchParams.set("qa", `${locale.label}-${viewport.label}-${Date.now()}`);

    const response = await page.goto(qaUrl.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.waitForSelector(".embir2100 h1", { timeout: 15_000 });

    await page.evaluate(() => {
      const cookieButton = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent?.trim() === "Essential only",
      );
      cookieButton?.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 700));

    const initial = await page.evaluate((expectedH1) => {
      const root = document.documentElement;
      const h1s = Array.from(document.querySelectorAll("h1"));
      return {
        h1Count: h1s.length,
        h1: h1s[0]?.textContent?.replace(/\s+/g, " ").trim() || "",
        expectedH1,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        overflow: root.scrollWidth > root.clientWidth + 1,
        chapterCount: document.querySelectorAll(".e21-chapter").length,
        majorSectionCount: document.querySelectorAll(".e21-hero, .e21-chapter, .e21-final").length,
        footerVisible: Boolean(document.querySelector("footer")),
      };
    }, locale.h1);

    let mobileMenu = null;
    if (viewport.width <= 760) {
      await page.click(".e21-nav__toggle");
      mobileMenu = await page.evaluate(() => {
        const toggle = document.querySelector(".e21-nav__toggle");
        const intentions = Array.from(document.querySelectorAll(".e21-nav__links a")).find(
          (link) => /Intentions|Intenciones|Absichten|Intenzioni/.test(link.textContent || ""),
        );
        const universe = Array.from(document.querySelectorAll(".e21-nav__links a")).find(
          (link) => /Univers|Universe|Universo|Universum/.test(link.textContent || ""),
        );
        const languageButton = document.querySelector(".e21-language__button");
        return {
          expanded: toggle?.getAttribute("aria-expanded"),
          intentionsVisible: intentions ? getComputedStyle(intentions).display !== "none" : false,
          universeVisible: universe ? getComputedStyle(universe).display !== "none" : false,
          languageSwitcherVisible: languageButton ? getComputedStyle(languageButton).display !== "none" : false,
        };
      });
      await page.click(".e21-nav__toggle");
    }

    await page.$eval('.e21-control input[type="range"]', (element) => {
      const input = element;
      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      valueSetter?.call(input, "85");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const sliderOutput = await page.$eval(
      ".e21-control output",
      (element) => element.textContent?.trim() || "",
    );

    await page.evaluate(async () => {
      const tab = document.querySelectorAll(".e21-universe__tab")[1];
      tab?.scrollIntoView({ block: "center" });
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      tab?.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const universeTab = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".e21-universe__tab")).find(
          (element) => element.getAttribute("aria-selected") === "true",
        )?.textContent?.replace(/\s+/g, " ").trim() || "",
    );

    await page.evaluate(async () => {
      const tab = document.querySelectorAll(".e21-intentions__item")[3];
      tab?.scrollIntoView({ block: "center", inline: "center" });
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      tab?.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const intentionState = await page.evaluate(() => ({
      selected:
        Array.from(document.querySelectorAll(".e21-intentions__item")).find(
          (element) => element.getAttribute("aria-selected") === "true",
        )?.textContent?.trim() || "",
      preview: document.querySelector(".e21-intentions__preview p")?.textContent?.trim() || "",
    }));

    let mobileIntentionsScreenshotPath = null;
    if (locale.label === "fr" && viewport.label === "mobile-390") {
      mobileIntentionsScreenshotPath = path.join(
        artifactDir,
        "fr-mobile-390-intentions.png",
      );
      await page.screenshot({
        path: mobileIntentionsScreenshotPath,
        fullPage: false,
      });
    }

    const mobileIntentionsLayout =
      viewport.width <= 760
        ? await page.evaluate(() => {
            const rail = document.querySelector(".e21-intentions__rail");
            const firstItem = document.querySelector(".e21-intentions__item");
            const railStyles = rail ? getComputedStyle(rail) : null;
            const itemStyles = firstItem ? getComputedStyle(firstItem) : null;
            return {
              display: railStyles?.display || "",
              columns: railStyles?.gridTemplateColumns || "",
              itemFontFamily: itemStyles?.fontFamily || "",
              itemMinWidth: itemStyles?.minWidth || "",
            };
          })
        : null;

    const viewportScreenshotPath = path.join(
      artifactDir,
      `${locale.label}-${viewport.label}-viewport.png`,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((resolve) => setTimeout(resolve, 150));
    await page.screenshot({ path: viewportScreenshotPath, fullPage: false });

    if (locale.label === "fr" && viewport.label === "desktop-1536") {
      const chapterScreenshots = [
        [".e21-reciprocity__layout", "fr-desktop-1536-compatibility.png"],
        [".e21-intentions .e21-shell", "fr-desktop-1536-intentions.png"],
        [".e21-universe__experience", "fr-desktop-1536-universe.png"],
        [".e21-final .e21-shell", "fr-desktop-1536-final.png"],
      ];
      for (const [selector, filename] of chapterScreenshots) {
        const element = await page.$(selector);
        await element?.evaluate((node) => node.scrollIntoView({ block: "center" }));
        await new Promise((resolve) => setTimeout(resolve, 150));
        await page.screenshot({ path: path.join(artifactDir, filename), fullPage: false });
      }
    }

    const screenshotPath = path.join(
      artifactDir,
      `${locale.label}-${viewport.label}-full.png`,
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const failures = [];
    if (response?.status() !== 200) failures.push(`HTTP ${response?.status()}`);
    if (initial.h1Count !== 1) failures.push(`H1 count ${initial.h1Count}`);
    if (initial.h1 !== locale.h1) failures.push(`Unexpected H1: ${initial.h1}`);
    if (initial.overflow) failures.push(`Horizontal overflow ${initial.scrollWidth}/${initial.clientWidth}`);
    if (initial.chapterCount !== 3) failures.push(`Expected 3 story chapters, got ${initial.chapterCount}`);
    if (initial.majorSectionCount !== 5) failures.push(`Expected 5 major sections, got ${initial.majorSectionCount}`);
    if (!initial.footerVisible) failures.push("Footer missing");
    if (mobileMenu && mobileMenu.expanded !== "true") failures.push("Mobile menu did not open");
    if (mobileMenu && !mobileMenu.intentionsVisible) failures.push("Intentions link hidden in mobile menu");
    if (mobileMenu && !mobileMenu.universeVisible) failures.push("Universe link hidden in mobile menu");
    if (mobileMenu && !mobileMenu.languageSwitcherVisible) failures.push("Language switcher hidden in mobile menu");
    if (sliderOutput !== "85") failures.push(`Slider output stayed at ${sliderOutput}`);
    if (!/02/.test(universeTab)) failures.push(`Universe tab stayed at ${universeTab}`);
    if (intentionState.selected !== expectedSportLabel[locale.label]) failures.push(`Intent stayed at ${intentionState.selected}`);
    if (!intentionState.preview) failures.push("Intent preview missing");
    if (mobileIntentionsLayout && mobileIntentionsLayout.display !== "grid") {
      failures.push(`Mobile intentions layout stayed ${mobileIntentionsLayout.display}`);
    }
    if (mobileIntentionsLayout && !mobileIntentionsLayout.columns.includes(" ")) {
      failures.push(`Mobile intentions columns invalid: ${mobileIntentionsLayout.columns}`);
    }
    if (mobileIntentionsLayout && mobileIntentionsLayout.itemMinWidth !== "0px") {
      failures.push(`Mobile intentions item min-width ${mobileIntentionsLayout.itemMinWidth}`);
    }
    if (consoleErrors.length) failures.push(`${consoleErrors.length} console errors`);
    if (pageErrors.length) failures.push(`${pageErrors.length} page errors`);

    results.push({
      locale: locale.label,
      viewport: viewport.label,
      status: response?.status() || 0,
      ...initial,
      mobileMenu,
      sliderOutput,
      universeTab,
      intentionState,
      mobileIntentionsLayout,
      mobileIntentionsScreenshotPath,
      consoleErrors,
      pageErrors,
      viewportScreenshotPath,
      screenshotPath,
      failures,
      verdict: failures.length === 0 ? "PASS" : "FAIL",
    });

    await context.close();
  }
}

await browser.close();

const reportPath = path.join(artifactDir, "qa-report.json");
await fs.writeFile(reportPath, JSON.stringify(results, null, 2));

for (const result of results) {
  console.log(
    `${result.verdict.padEnd(4)} ${result.locale.padEnd(2)} ${result.viewport.padEnd(12)} HTTP ${result.status}`,
  );
  for (const failure of result.failures) console.log(`     - ${failure}`);
}

const failed = results.filter((result) => result.verdict === "FAIL");
console.log(`Report: ${reportPath}`);
if (failed.length) process.exitCode = 1;
