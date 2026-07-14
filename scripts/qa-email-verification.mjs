#!/usr/bin/env node
import { chromium, firefox, webkit } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3200";
const browserTypes = { chromium, webkit, firefox };
const requestedBrowsers = process.env.QA_BROWSERS
  ? process.env.QA_BROWSERS.split(",").map((value) => value.trim()).filter(Boolean)
  : Object.keys(browserTypes);
const routes = [
  { locale: "fr", path: "/fr/auth/verify-email", expected: "Aucun lien de validation détecté." },
  { locale: "en", path: "/en/auth/verify-email", expected: "No verification link was detected." },
];
const viewports = [
  { label: "mobile-390", width: 390, height: 844 },
  { label: "desktop-1440", width: 1440, height: 900 },
];
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
        await page.getByRole("heading", { name: route.expected }).waitFor({ timeout: 15_000 });
        const state = await page.evaluate(() => {
          const root = document.documentElement;
          const visibleControls = Array.from(document.querySelectorAll("main a, main button")).filter(
            (element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
            },
          );
          return {
            clientWidth: root.clientWidth,
            scrollWidth: root.scrollWidth,
            smallTouchTargets: visibleControls
              .map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                  label: element.textContent?.replace(/\s+/g, " ").trim() || element.tagName,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                };
              })
              .filter((target) => target.width < 44 || target.height < 44),
          };
        });
        const invalid = await context.request.post(`${baseUrl}/api/auth/email/verify`, {
          headers: { "Content-Type": "application/json", Origin: baseUrl },
          data: { token: "invalid" },
        });
        const failures = [];
        if (response?.status() !== 200) failures.push(`HTTP ${response?.status()}`);
        if (invalid.status() !== 400) failures.push(`Invalid token HTTP ${invalid.status()}`);
        if (state.scrollWidth > state.clientWidth + 1) failures.push(`Horizontal overflow ${state.scrollWidth}/${state.clientWidth}`);
        if (viewport.width <= 390 && state.smallTouchTargets.length > 0) failures.push(`Small touch targets: ${JSON.stringify(state.smallTouchTargets)}`);
        if (consoleErrors.length > 0) failures.push(`${consoleErrors.length} console error(s)`);
        if (pageErrors.length > 0) failures.push(`${pageErrors.length} page error(s)`);
        results.push({
          browser: browserName,
          locale: route.locale,
          viewport: viewport.label,
          status: response?.status() || 0,
          invalidTokenStatus: invalid.status(),
          ...state,
          consoleErrors,
          pageErrors,
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

for (const result of results) {
  console.log(`${result.verdict.padEnd(4)} ${result.browser.padEnd(8)} ${result.locale} ${result.viewport} HTTP ${result.status} invalid=${result.invalidTokenStatus}`);
  for (const failure of result.failures) console.log(`     - ${failure}`);
}
process.exitCode = results.some((result) => result.verdict === "FAIL") ? 1 : 0;
