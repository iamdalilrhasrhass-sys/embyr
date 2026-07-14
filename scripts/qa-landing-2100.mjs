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
];

await fs.mkdir(artifactDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];

for (const locale of locales) {
  for (const viewport of viewports) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.width <= 390 ? 2 : 1,
      isMobile: viewport.width <= 390,
    });
    await page.setCookie(
      { name: "NEXT_LOCALE", value: locale.label, url: baseUrl },
      { name: "embir_locale_source", value: "manual", url: baseUrl },
    );

    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(`${baseUrl}${locale.path}`, {
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
        footerVisible: Boolean(document.querySelector("footer")),
        smallTouchTargets: Array.from(
          document.querySelectorAll(".e21-nav a, .e21-nav button, .e21-actions a, footer a"),
        )
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return `${element.textContent?.trim() || element.getAttribute("aria-label") || element.tagName} (${Math.round(rect.width)}x${Math.round(rect.height)})`;
          }),
      };
    }, locale.h1);

    let mobileMenu = null;
    if (viewport.width <= 760) {
      await page.click(".e21-nav__toggle");
      mobileMenu = await page.evaluate(() => {
        const toggle = document.querySelector(".e21-nav__toggle");
        const safety = Array.from(document.querySelectorAll(".e21-nav__links a")).find(
          (link) => /Sécurité|Safety/.test(link.textContent || ""),
        );
        const journal = Array.from(document.querySelectorAll(".e21-nav__links a")).find(
          (link) => /journal/i.test(link.textContent || ""),
        );
        return {
          expanded: toggle?.getAttribute("aria-expanded"),
          safetyVisible: safety ? getComputedStyle(safety).display !== "none" : false,
          journalVisible: journal ? getComputedStyle(journal).display !== "none" : false,
        };
      });
      await page.click(".e21-nav__toggle");
    }

    await page.$eval('input[aria-label="Orientation"]', (element) => {
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

    const viewportScreenshotPath = path.join(
      artifactDir,
      `${locale.label}-${viewport.label}-viewport.png`,
    );
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      return new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
    await page.screenshot({ path: viewportScreenshotPath, fullPage: false });

    if (locale.label === "fr" && viewport.label === "desktop-1536") {
      const chapterScreenshots = [
        [".e21-reciprocity__layout", "fr-desktop-1536-compatibility.png"],
        [".e21-universe__experience", "fr-desktop-1536-universe.png"],
        [".e21-journal .e21-shell", "fr-desktop-1536-journal.png"],
      ];
      for (const [selector, filename] of chapterScreenshots) {
        const element = await page.$(selector);
        if (element && (await element.isVisible())) {
          await element.screenshot({ path: path.join(artifactDir, filename) });
        }
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
    if (initial.chapterCount < 4) failures.push(`Only ${initial.chapterCount} chapters`);
    if (!initial.footerVisible) failures.push("Footer missing");
    if (viewport.width <= 760 && initial.smallTouchTargets.length) {
      failures.push(`Small touch targets: ${initial.smallTouchTargets.join(", ")}`);
    }
    if (mobileMenu && mobileMenu.expanded !== "true") failures.push("Mobile menu did not open");
    if (mobileMenu && !mobileMenu.safetyVisible) failures.push("Safety link hidden in mobile menu");
    if (mobileMenu && !mobileMenu.journalVisible) failures.push("Journal link hidden in mobile menu");
    if (sliderOutput !== "85") failures.push(`Slider output stayed at ${sliderOutput}`);
    if (!/Intentions/.test(universeTab)) failures.push(`Universe tab stayed at ${universeTab}`);
    if (intentionState.selected !== "Sport") failures.push(`Intent stayed at ${intentionState.selected}`);
    if (!intentionState.preview) failures.push("Intent preview missing");
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
process.exit(failed.length ? 1 : 0);
