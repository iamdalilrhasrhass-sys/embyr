#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3200";
const outputDirectory = process.env.QA_OUTPUT_DIR || "/tmp/embir-growth-2500-qa";
const browserTypes = { chromium, webkit, firefox };
const requestedBrowsers = process.env.QA_BROWSERS
  ? process.env.QA_BROWSERS.split(",").map((value) => value.trim()).filter(Boolean)
  : Object.keys(browserTypes);
const routes = [
  { locale: "fr", path: "/fr/lausanne", expected: "Moins de profils à faire défiler." },
  { locale: "en", path: "/lausanne", expected: "Fewer profiles to scroll through." },
];
const viewports = [
  { label: "mobile-390", width: 390, height: 844 },
  { label: "desktop-1440", width: 1440, height: 900 },
];

await fs.mkdir(outputDirectory, { recursive: true });
const results = [];

for (const browserName of requestedBrowsers) {
  const browserType = browserTypes[browserName];
  if (!browserType) throw new Error(`Unsupported browser: ${browserName}`);
  const browser = await browserType.launch({ headless: true });
  try {
    for (const route of routes) {
      for (const viewport of viewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.width <= 390 ? 2 : 1,
          isMobile: viewport.width <= 390,
          hasTouch: viewport.width <= 390,
          locale: route.locale === "fr" ? "fr-CH" : "en-US",
        });
        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));

        const response = await page.goto(`${baseUrl}${route.path}`, {
          waitUntil: "networkidle",
          timeout: 45_000,
        });
        await page.locator("h1").waitFor({ timeout: 15_000 });
        const essentialButton = page.getByRole("button", { name: /Essentiels uniquement|Essential only/i });
        if (await essentialButton.isVisible().catch(() => false)) await essentialButton.click();

        const state = await page.evaluate(() => {
          const root = document.documentElement;
          const visible = (element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
          };
          const touchTargets = Array.from(document.querySelectorAll("nav a, main a, main button, main summary"))
            .filter(visible)
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                label: element.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) || element.tagName,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              };
            });
          const registration = Array.from(document.querySelectorAll("a")).find((link) => link.href.includes("/auth/register"));
          return {
            h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() || "",
            h1Count: document.querySelectorAll("h1").length,
            clientWidth: root.clientWidth,
            scrollWidth: root.scrollWidth,
            registrationHref: registration?.getAttribute("href") || "",
            faqCount: document.querySelectorAll("details").length,
            smallTouchTargets: touchTargets.filter((target) => target.width < 44 || target.height < 44),
          };
        });

        const failures = [];
        if (response?.status() !== 200) failures.push(`HTTP ${response?.status()}`);
        if (state.h1Count !== 1) failures.push(`H1 count ${state.h1Count}`);
        if (!state.h1.includes(route.expected)) failures.push(`Unexpected H1: ${state.h1}`);
        if (state.scrollWidth > state.clientWidth + 1) failures.push(`Horizontal overflow ${state.scrollWidth}/${state.clientWidth}`);
        if (!state.registrationHref.includes("utm_campaign=lausanne_launch_2500")) failures.push("Missing campaign attribution on registration CTA");
        if (state.faqCount !== 4) failures.push(`FAQ count ${state.faqCount}`);
        if (viewport.width <= 390 && state.smallTouchTargets.length > 0) failures.push(`Small touch targets: ${JSON.stringify(state.smallTouchTargets)}`);
        if (consoleErrors.length > 0) failures.push(`${consoleErrors.length} console error(s)`);
        if (pageErrors.length > 0) failures.push(`${pageErrors.length} page error(s)`);

        let screenshot = null;
        if (browserName === "chromium") {
          screenshot = path.join(outputDirectory, `${route.locale}-${viewport.label}.png`);
          await page.screenshot({ path: screenshot, fullPage: true });
        }
        results.push({
          browser: browserName,
          locale: route.locale,
          viewport: viewport.label,
          status: response?.status() || 0,
          ...state,
          consoleErrors,
          pageErrors,
          screenshot,
          failures,
          verdict: failures.length === 0 ? "PASS" : "FAIL",
        });
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

const reportPath = path.join(outputDirectory, "report.json");
await fs.writeFile(reportPath, `${JSON.stringify(results, null, 2)}\n`);
for (const result of results) {
  console.log(`${result.verdict.padEnd(4)} ${result.browser.padEnd(8)} ${result.locale} ${result.viewport} HTTP ${result.status}`);
  for (const failure of result.failures) console.log(`     - ${failure}`);
}
console.log(`Report: ${reportPath}`);
process.exitCode = results.some((result) => result.verdict === "FAIL") ? 1 : 0;
