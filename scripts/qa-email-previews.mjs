import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, webkit } from "playwright";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewDirectory = path.join(projectRoot, "artifacts", "email-previews");
const screenshotDirectory = path.join(previewDirectory, "screenshots");
const reportPath = path.join(previewDirectory, "report.json");
const widths = [320, 375, 390, 430];
const colorSchemes = ["light", "dark"];
const engines = [
  ["chromium", chromium],
  ["webkit", webkit],
];

const manifest = JSON.parse(
  await readFile(path.join(previewDirectory, "manifest.json"), "utf8"),
);
if (!Array.isArray(manifest.fixtures) || manifest.fixtures.length === 0) {
  throw new Error("No email preview fixtures found; run render-email-previews.ts first");
}

await rm(screenshotDirectory, { recursive: true, force: true });
await mkdir(screenshotDirectory, { recursive: true });

const fixtureFiles = await Promise.all(
  manifest.fixtures.map(async (fixture) => {
    const [html, text] = await Promise.all([
      readFile(path.join(previewDirectory, fixture.htmlFile), "utf8"),
      readFile(path.join(previewDirectory, fixture.textFile), "utf8"),
    ]);
    return { ...fixture, html, text };
  }),
);

const report = {
  generatedAt: new Date().toISOString(),
  previewDirectory,
  browsers: engines.map(([name]) => name),
  widths,
  colorSchemes,
  fixtures: manifest.fixtures.map(({ name, description }) => ({ name, description })),
  results: [],
  browserErrors: [],
  summary: {
    scenarios: 0,
    passed: 0,
    failed: 0,
    screenshots: 0,
  },
};

function staticFixtureIssues(fixture) {
  const issues = [];
  if (!fixture.html.trim()) issues.push("HTML version is empty");
  if (!fixture.text.trim()) issues.push("Text version is empty");
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(fixture.html)) {
    issues.push("Raw ISO timestamp is visible in HTML");
  }
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(fixture.text)) {
    issues.push("Raw ISO timestamp is visible in text");
  }
  if (/linear-gradient|radial-gradient|conic-gradient/i.test(fixture.html)) {
    issues.push("Gradient detected in email HTML");
  }
  if (!/name=["']color-scheme["']/i.test(fixture.html)) {
    issues.push("color-scheme meta tag is missing");
  }
  if (!/name=["']supported-color-schemes["']/i.test(fixture.html)) {
    issues.push("supported-color-schemes meta tag is missing");
  }
  return issues;
}

async function inspectPage(page, viewportWidth) {
  return page.evaluate((expectedWidth) => {
    function parseRgb(value) {
      const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: match[4] === undefined ? 1 : Number(match[4]),
      };
    }

    function luminance(color) {
      const channels = [color.r, color.g, color.b].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }

    function contrastRatio(foreground, background) {
      const light = Math.max(luminance(foreground), luminance(background));
      const dark = Math.min(luminance(foreground), luminance(background));
      return (light + 0.05) / (dark + 0.05);
    }

    function effectiveBackground(element) {
      let current = element;
      while (current) {
        const parsed = parseRgb(getComputedStyle(current).backgroundColor);
        if (parsed && parsed.a >= 0.99) return parsed;
        current = current.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    }

    function isVisible(element) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    const issues = [];
    const htmlWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    if (htmlWidth > expectedWidth + 1 || bodyWidth > expectedWidth + 1) {
      issues.push(
        `Horizontal overflow: html=${htmlWidth}px body=${bodyWidth}px viewport=${expectedWidth}px`,
      );
    }

    const card = document.querySelector("table[style*='max-width:600px']");
    const cardRect = card?.getBoundingClientRect() ?? null;
    if (!cardRect) {
      issues.push("600px email card was not found");
    } else {
      if (cardRect.width > 601) issues.push(`Email card is ${cardRect.width.toFixed(1)}px wide`);
      if (cardRect.left < -1 || cardRect.right > expectedWidth + 1) {
        issues.push("Email card leaves the viewport");
      }
    }

    const ctas = Array.from(document.querySelectorAll("a.embir-cta")).filter(isVisible);
    if (ctas.length === 0) {
      issues.push("No visible CTA found");
    }
    const ctaChecks = ctas.map((link) => {
      const rect = link.getBoundingClientRect();
      const href = link.getAttribute("href") || "";
      let validUrl = false;
      try {
        const url = new URL(href);
        validUrl = url.protocol === "https:" &&
          (url.hostname === "embir.xyz" || url.hostname.endsWith(".embir.xyz"));
        if (url.pathname === "/admin/analytics" && (url.search || url.hash || /token/i.test(href))) {
          issues.push("Admin cockpit CTA contains a query, fragment, or token");
        }
      } catch {
        validUrl = false;
      }
      if (!validUrl) issues.push(`CTA has an invalid Embir URL: ${href || "(empty)"}`);
      if (rect.height < 44) issues.push(`CTA touch target is ${rect.height.toFixed(1)}px high`);
      if (rect.left < -1 || rect.right > expectedWidth + 1) {
        issues.push("CTA leaves the viewport");
      }
      return {
        label: link.textContent?.trim() ?? "",
        href,
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
      };
    });

    const selectors = "h1,h2,p,a,li,td";
    const textElements = Array.from(document.querySelectorAll(selectors)).filter((element) => {
      if (!isVisible(element) || !(element.textContent || "").trim()) return false;
      return !Array.from(element.children).some(
        (child) => isVisible(child) && (child.textContent || "").trim(),
      );
    });
    const contrastChecks = [];
    for (const element of textElements) {
      const style = getComputedStyle(element);
      const foreground = parseRgb(style.color);
      const background = effectiveBackground(element);
      if (!foreground) {
        issues.push(`Could not parse text color for ${element.tagName.toLowerCase()}`);
        continue;
      }
      const ratio = contrastRatio(foreground, background);
      const fontSize = Number.parseFloat(style.fontSize);
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const largeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const required = largeText ? 3 : 4.5;
      const label = (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90);
      contrastChecks.push({
        element: element.tagName.toLowerCase(),
        label,
        ratio: Number(ratio.toFixed(2)),
        required,
        foreground: style.color,
        background: `rgb(${background.r}, ${background.g}, ${background.b})`,
      });
      if (ratio + 0.01 < required) {
        issues.push(`Insufficient contrast ${ratio.toFixed(2)}:1 for “${label}” (needs ${required}:1)`);
      }
    }

    return {
      issues: [...new Set(issues)],
      measurements: {
        viewportWidth: expectedWidth,
        documentWidth: htmlWidth,
        bodyWidth,
        documentHeight: document.documentElement.scrollHeight,
        cardWidth: cardRect ? Number(cardRect.width.toFixed(2)) : null,
      },
      ctas: ctaChecks,
      contrast: {
        checked: contrastChecks.length,
        minimumRatio: contrastChecks.length
          ? Math.min(...contrastChecks.map((check) => check.ratio))
          : null,
        failures: contrastChecks.filter((check) => check.ratio + 0.01 < check.required),
      },
    };
  }, viewportWidth);
}

for (const [engineName, browserType] of engines) {
  let browser;
  try {
    browser = await browserType.launch({ headless: true });
    for (const width of widths) {
      for (const colorScheme of colorSchemes) {
        const context = await browser.newContext({
          viewport: { width, height: 844 },
          colorScheme,
          reducedMotion: "reduce",
          locale: "fr-CH",
          timezoneId: "Europe/Zurich",
          deviceScaleFactor: 1,
        });
        await context.route(/^https?:\/\//, (route) => route.abort("blockedbyclient"));
        const page = await context.newPage();
        let externalRequests = [];
        page.on("request", (request) => {
          if (/^https?:\/\//.test(request.url())) externalRequests.push(request.url());
        });
        for (const fixture of fixtureFiles) {
          const staticIssues = staticFixtureIssues(fixture);
          const startedAt = Date.now();
          externalRequests = [];
          await page.setContent(fixture.html, { waitUntil: "load" });
          await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
          const inspection = await inspectPage(page, width);
          const screenshotName = `${fixture.name}--${engineName}--${width}--${colorScheme}.png`;
          await page.screenshot({
            path: path.join(screenshotDirectory, screenshotName),
            fullPage: true,
            animations: "disabled",
          });
          const issues = [
            ...new Set([
              ...staticIssues,
              ...inspection.issues,
              ...(externalRequests.length
                ? [`External network request detected: ${externalRequests[0]}`]
                : []),
            ]),
          ];
          report.results.push({
            fixture: fixture.name,
            browser: engineName,
            width,
            colorScheme,
            passed: issues.length === 0,
            durationMs: Date.now() - startedAt,
            screenshot: path.relative(previewDirectory, path.join(screenshotDirectory, screenshotName)),
            textVersionBytes: Buffer.byteLength(fixture.text, "utf8"),
            issues,
            measurements: inspection.measurements,
            ctas: inspection.ctas,
            contrast: inspection.contrast,
          });
          report.summary.scenarios += 1;
          report.summary.screenshots += 1;
          if (issues.length === 0) report.summary.passed += 1;
          else report.summary.failed += 1;
        }
        await context.close();
      }
    }
  } catch (error) {
    report.browserErrors.push({
      browser: engineName,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await browser?.close();
  }
}

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (report.browserErrors.length > 0 || report.summary.failed > 0) {
  console.error(
    `Email preview QA failed: ${report.summary.failed}/${report.summary.scenarios} scenarios failed, ${report.browserErrors.length} browser error(s).`,
  );
  console.error(`Report: ${reportPath}`);
  process.exitCode = 1;
} else {
  console.log(
    `Email preview QA passed: ${report.summary.passed}/${report.summary.scenarios} scenarios and ${report.summary.screenshots} screenshots.`,
  );
  console.log(`Report: ${reportPath}`);
}
