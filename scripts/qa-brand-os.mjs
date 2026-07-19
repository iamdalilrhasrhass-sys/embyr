import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, request as playwrightRequest, webkit } from "playwright";

const baseUrl = new URL(process.env.BASE_URL ?? "http://127.0.0.1:3201");
const mode = process.env.QA_MODE ?? "public";
const outputDir = path.resolve(process.env.QA_OUTPUT_DIR ?? "output/brand-os");
const requestedBrowsers = (process.env.QA_BROWSERS ?? "chromium,firefox,webkit")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

if (baseUrl.hostname === "embir.xyz" && mode !== "public") {
  throw new Error("Live Brand OS QA is read-only: set QA_MODE=public");
}
if (mode !== "public") {
  throw new Error(`Unsupported QA_MODE=${mode}; Brand OS QA never mutates application data`);
}

const allViewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];
const crossBrowserViewports = allViewports.filter(({ name }) =>
  name === "390x844" || name === "1440x900",
);
const engines = { chromium, firefox, webkit };
const report = {
  baseUrl: baseUrl.toString(),
  mode,
  startedAt: new Date().toISOString(),
  browsers: [],
  accessibility: {},
  assets: [],
  errors: [],
};

await mkdir(outputDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function installReadOnlyGuard(context, errors) {
  await context.addInitScript(() => {
    window.localStorage.setItem("embir_cookie_consent", "essential");
  });
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (!['GET', 'HEAD'].includes(request.method())) {
      const message = `blocked mutation ${request.method()} ${request.url()}`;
      if (new URL(request.url()).origin === baseUrl.origin) errors.push(message);
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
}

async function observe(page, errors) {
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "unknown";
    const url = new URL(request.url());
    const cancelledBrowserGet =
      failure === "net::ERR_ABORTED" &&
      request.method() === "GET" &&
      url.origin === baseUrl.origin;
    // Chromium cancels speculative RSC, image and redirect requests when a
    // context settles. Primary navigations and required assets are asserted.
    if (cancelledBrowserGet) return;
    if (url.origin === baseUrl.origin && failure !== "net::ERR_BLOCKED_BY_CLIENT") {
      errors.push(`requestfailed: ${request.url()} (${failure})`);
    }
  });
}

async function assertHealthyPage(page, pathname, label) {
  const response = await page.goto(new URL(pathname, baseUrl).toString(), {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  assert(response && response.status() < 400, `${label}: HTTP ${response?.status() ?? "none"}`);
  await page.locator("body").waitFor({ state: "visible" });
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  assert(overflow.page <= overflow.viewport + 1, `${label}: horizontal overflow ${overflow.page}/${overflow.viewport}`);
}

async function assertLogoStable(page, label) {
  const logo = page.locator(".embir-logo").first();
  await logo.waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  const before = await logo.boundingBox();
  await page.waitForTimeout(350);
  const after = await logo.boundingBox();
  assert(before && after, `${label}: logo has no stable box`);
  for (const key of ["x", "y", "width", "height"]) {
    assert(Math.abs(before[key] - after[key]) <= 1, `${label}: logo shifted on ${key}`);
  }
  const accessibleNames = await page.locator('.embir-logo [aria-label="Embir"], .embir-logo[aria-label="Embir"]').count();
  assert(accessibleNames <= 1, `${label}: duplicate accessible logo names`);
}

async function assertTouchTarget(locator, label) {
  const box = await locator.boundingBox();
  const tolerance = 0.05;
  assert(
    box && box.width + tolerance >= 44 && box.height + tolerance >= 44,
    `${label}: touch target ${box?.width}x${box?.height}`,
  );
}

for (const browserName of requestedBrowsers) {
  const engine = engines[browserName];
  if (!engine) throw new Error(`Unknown browser ${browserName}`);
  const browserRecord = { name: browserName, viewports: [], errors: [] };
  report.browsers.push(browserRecord);
  let browser;
  try {
    browser = await engine.launch({ headless: true });
    const viewports = browserName === "chromium" ? allViewports : crossBrowserViewports;
    for (const viewport of viewports) {
      const errors = [];
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        reducedMotion: "no-preference",
      });
      await installReadOnlyGuard(context, errors);
      const page = await context.newPage();
      await observe(page, errors);
      const label = `${browserName}-${viewport.name}`;
      try {
        await assertHealthyPage(page, "/fr", label);
        await assertLogoStable(page, label);
        if (viewport.width <= 760) {
          const toggle = page.locator(".e21-nav__toggle");
          await assertTouchTarget(toggle, `${label} menu`);
          await toggle.click();
          assert(await toggle.getAttribute("aria-expanded") === "true", `${label}: menu did not open`);
          await page.locator('#embir-landing-navigation[data-open="true"]').waitFor({ state: "visible" });
          if (viewport.name === "390x844") {
            await page.screenshot({ path: path.join(outputDir, `${label}-menu.png`), fullPage: true });
          }
          await page.keyboard.press("Escape");
          assert(await toggle.getAttribute("aria-expanded") === "false", `${label}: Escape did not close menu`);
        }
        await page.screenshot({ path: path.join(outputDir, `${label}-landing.png`), fullPage: true });
        assert(errors.length === 0, `${label}: ${errors.join(" | ")}`);
        browserRecord.viewports.push({ ...viewport, status: "passed" });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        browserRecord.viewports.push({ ...viewport, status: "failed", error: message });
        report.errors.push(message, ...errors);
      } finally {
        await context.close();
      }
    }

    if (browserName === "chromium") {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      const errors = [];
      await installReadOnlyGuard(context, errors);
      const page = await context.newPage();
      await observe(page, errors);
      for (const route of ["/", "/fr", "/fr/auth/login", "/fr/auth/register", "/fr/privacy", "/fr/terms", "/fr/safety"]) {
        try {
          await assertHealthyPage(page, route, `route ${route}`);
          if (route === "/fr/auth/login" || route === "/fr/auth/register") {
            await assertLogoStable(page, route);
            await page.locator('input[type="email"]').waitFor({ state: "visible" });
            await page.locator('input[type="password"]').waitFor({ state: "visible" });
            await page.screenshot({
              path: path.join(outputDir, `chromium-390x844-auth-${route.endsWith("login") ? "login" : "register"}.png`),
              fullPage: true,
            });
          }
        } catch (error) {
          report.errors.push(error instanceof Error ? error.message : String(error));
        }
      }
      await assertHealthyPage(page, "/fr", "reduced-motion landing");
      await page.screenshot({ path: path.join(outputDir, "chromium-390x844-reduced-motion.png"), fullPage: true });
      report.errors.push(...errors);
      await context.close();

      const reflowErrors = [];
      const reflowContext = await browser.newContext({
        // A 1280 px desktop viewport at 200% browser zoom reflows to 640 CSS px.
        viewport: { width: 640, height: 900 },
        deviceScaleFactor: 2,
        reducedMotion: "reduce",
      });
      await installReadOnlyGuard(reflowContext, reflowErrors);
      const reflowPage = await reflowContext.newPage();
      await observe(reflowPage, reflowErrors);
      try {
        await assertHealthyPage(reflowPage, "/fr", "200% zoom reflow");
        await assertLogoStable(reflowPage, "200% zoom reflow");
        await reflowPage.keyboard.press("Tab");
        assert(
          await reflowPage.evaluate(() => document.activeElement !== document.body),
          "keyboard: first Tab did not move focus",
        );
        report.accessibility.zoom200 = "passed (1280px physical / 640px CSS)";
        report.accessibility.keyboardFocus = "passed";
        assert(reflowErrors.length === 0, `200% zoom reflow: ${reflowErrors.join(" | ")}`);
      } catch (error) {
        report.errors.push(error instanceof Error ? error.message : String(error));
      } finally {
        await reflowContext.close();
      }

      const landscapeErrors = [];
      const landscapeContext = await browser.newContext({
        viewport: { width: 844, height: 390 },
        reducedMotion: "reduce",
      });
      await installReadOnlyGuard(landscapeContext, landscapeErrors);
      const landscapePage = await landscapeContext.newPage();
      await observe(landscapePage, landscapeErrors);
      try {
        await assertHealthyPage(landscapePage, "/fr", "mobile landscape");
        await assertLogoStable(landscapePage, "mobile landscape");
        report.accessibility.mobileLandscape = "passed (844x390)";
        assert(landscapeErrors.length === 0, `mobile landscape: ${landscapeErrors.join(" | ")}`);
      } catch (error) {
        report.errors.push(error instanceof Error ? error.message : String(error));
      } finally {
        await landscapeContext.close();
      }

      const onboardingErrors = [];
      const onboardingContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "no-preference",
      });
      await installReadOnlyGuard(onboardingContext, onboardingErrors);
      // The proxy only checks for the presence of the session cookie. A local,
      // synthetic value lets the real onboarding UI render while the profile GET
      // is fulfilled below and every mutation remains blocked by the guard.
      await onboardingContext.addCookies([{
        name: "token",
        value: "brand-os-read-only-fixture",
        url: baseUrl.origin,
        httpOnly: true,
        sameSite: "Lax",
      }]);
      await onboardingContext.route("**/api/profile/me", (route) => route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          username: "Ari",
          age: 29,
          city: "Zurich",
          onboardingStep: 0,
          onboardingCompletedAt: null,
          acceptedIntents: [],
          activities: [],
          seekingGenders: [],
        }),
      }));
      const onboardingPage = await onboardingContext.newPage();
      await observe(onboardingPage, onboardingErrors);
      try {
        await assertHealthyPage(onboardingPage, "/fr/onboarding", "onboarding fixture");
        await onboardingPage.locator("h1").waitFor({ state: "visible" });
        await onboardingPage.evaluate(() => document.fonts.ready);
        await onboardingPage.waitForTimeout(1_000);
        await onboardingPage.screenshot({
          path: path.join(outputDir, "chromium-390x844-onboarding-fixture.png"),
          fullPage: true,
        });
        assert(onboardingErrors.length === 0, `onboarding fixture: ${onboardingErrors.join(" | ")}`);
      } catch (error) {
        report.errors.push(error instanceof Error ? error.message : String(error));
      } finally {
        await onboardingContext.close();
      }

      const revealErrors = [];
      const revealContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "no-preference",
      });
      await installReadOnlyGuard(revealContext, revealErrors);
      const revealPage = await revealContext.newPage();
      await observe(revealPage, revealErrors);
      try {
        // The real connection route is auth-protected. Load production CSS, then
        // render a deterministic, inert final-state fixture without a test account.
        await assertHealthyPage(revealPage, "/fr", "reciprocity reveal fixture shell");
        await revealPage.evaluate(() => {
          document.body.innerHTML = `
            <main class="min-h-screen bg-embir-void px-4 py-8 text-white sm:px-6 sm:py-12">
              <div class="mx-auto max-w-4xl">
                <header class="mt-8 rounded-[2rem] border border-embir-rose/15 bg-gradient-to-br from-embir-rose/[0.08] to-embir-rose/[0.03] p-6 sm:p-9">
                  <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-embir-rose">Connexion réciproque</p>
                  <h1 class="mt-3 font-serif text-4xl sm:text-5xl">Camille</h1>
                  <p class="mt-2 text-sm text-white/40">Zurich</p>
                </header>
                <section aria-labelledby="reveal-title" class="mt-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
                  <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-embir-rose">01 · Résonance</p>
                  <h2 id="reveal-title" class="mt-3 font-serif text-2xl">Quelle activité aimerais-tu partager bientôt ?</h2>
                  <div class="my-7 flex flex-col items-center" role="img" aria-label="La résonance est ouverte">
                    <div aria-hidden="true" class="embir-reciprocity-seal flex h-36 w-36 items-center justify-center rounded-full">
                      <img src="/brand/embir-mark.svg" width="112" height="112" alt="">
                    </div>
                    <p class="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-embir-rose-soft">La résonance est ouverte</p>
                  </div>
                  <div class="mt-5">
                    <p class="text-sm text-white/50">Vos réponses se dévoilent ensemble</p>
                    <div class="mt-3 grid gap-3 sm:grid-cols-2">
                      <blockquote class="rounded-2xl border border-white/[0.08] bg-black/20 p-5 text-sm leading-relaxed text-white/70"><span class="mb-2 block text-[10px] uppercase tracking-wider text-embir-rose">Toi</span>Un café calme et une vraie conversation.</blockquote>
                      <blockquote class="rounded-2xl border border-white/[0.08] bg-black/20 p-5 text-sm leading-relaxed text-white/70"><span class="mb-2 block text-[10px] uppercase tracking-wider text-embir-rose">Camille</span>Une balade au bord du lac, sans se presser.</blockquote>
                    </div>
                    <span class="mt-4 inline-flex min-h-12 items-center rounded-xl bg-embir-rose px-5 font-semibold text-embir-void">Ouvrir la conversation</span>
                  </div>
                </section>
              </div>
            </main>`;
        });
        await revealPage.locator("#reveal-title").waitFor({ state: "visible" });
        await revealPage.locator(".embir-reciprocity-seal").waitFor({ state: "visible" });
        await revealPage.screenshot({
          path: path.join(outputDir, "chromium-390x844-reciprocity-reveal-fixture.png"),
          fullPage: true,
        });
        assert(revealErrors.length === 0, `reciprocity reveal fixture: ${revealErrors.join(" | ")}`);
      } catch (error) {
        report.errors.push(error instanceof Error ? error.message : String(error));
      } finally {
        await revealContext.close();
      }

      const iconContext = await browser.newContext({ viewport: { width: 512, height: 512 } });
      await installReadOnlyGuard(iconContext, report.errors);
      const iconPage = await iconContext.newPage();
      for (const [tone, background, asset] of [
        ["dark", "#100a12", "/brand/embir-app-icon.svg"],
        ["light", "#f4c7d5", "/brand/embir-app-icon-light.svg"],
      ]) {
        await iconPage.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:${background}}img{display:block;width:100%;height:100%}</style><img src="${new URL(asset, baseUrl)}" alt="Embir ${tone} icon">`);
        await iconPage.locator("img").waitFor({ state: "visible" });
        await iconPage.screenshot({ path: path.join(outputDir, `icon-${tone}.png`) });
      }
      await iconContext.close();
    }
  } catch (error) {
    const message = `${browserName}: ${error instanceof Error ? error.message : String(error)}`;
    browserRecord.errors.push(message);
    report.errors.push(message);
  } finally {
    await browser?.close();
  }
}

const assetPaths = [
  "/favicon.ico",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/brand/embir-mark.svg",
  "/brand/embir-app-icon-light.svg",
  "/brand/embir-mark-dark.svg",
  "/brand/embir-mark-light.svg",
  "/brand/embir-mark-mono.svg",
  "/brand/embir-email-logo.png",
  "/api/og?title=Embir&subtitle=Shared%20intentions&locale=en",
];
const request = await playwrightRequest.newContext({ baseURL: baseUrl.toString() });
for (const asset of assetPaths) {
  try {
    const response = await request.get(asset, { timeout: 30_000 });
    const record = { path: asset, status: response.status(), contentType: response.headers()["content-type"] ?? "" };
    report.assets.push(record);
    if (!response.ok()) report.errors.push(`${asset}: HTTP ${response.status()}`);
  } catch (error) {
    report.errors.push(`${asset}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
await request.dispose();

report.finishedAt = new Date().toISOString();
report.status = report.errors.length === 0 ? "passed" : "failed";
await writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);

if (report.errors.length > 0) {
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Brand OS QA passed: ${outputDir}`);
}
