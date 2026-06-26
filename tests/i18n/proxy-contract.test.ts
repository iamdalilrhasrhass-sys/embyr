import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("proxy geodetects language before next-intl and respects manual cookie", async () => {
  const proxy = await readFile("src/proxy.ts", "utf8");

  assert.match(proxy, /pickPreferredLocale/);
  assert.match(proxy, /pathnameHasLocalePrefix/);
  assert.match(proxy, /LOCALE_COOKIE/);
  assert.match(proxy, /request\.cookies\.get\(LOCALE_COOKIE\)/);
  assert.match(proxy, /accept-language/i);
  assert.match(proxy, /NextResponse\.redirect/);
  assert.match(proxy, /createMiddleware\(routing\)/);
});

test("five-locale switcher is available to both landing and global nav", async () => {
  const [uiSwitcher, rootSwitcher, landingNav] = await Promise.all([
    readFile("src/components/ui/LanguageSwitcher.tsx", "utf8"),
    readFile("src/components/LanguageSwitcher.tsx", "utf8"),
    readFile("src/components/landing-2100/LandingNav.tsx", "utf8"),
  ]);

  for (const token of ["🇫🇷", "🇬🇧", "🇪🇸", "🇩🇪", "🇮🇹", "embir_locale"]) {
    assert.match(uiSwitcher, new RegExp(token));
  }

  assert.match(uiSwitcher, /localizePathname/);
  assert.match(uiSwitcher, /aria-expanded/);
  assert.match(rootSwitcher, /components\/ui\/LanguageSwitcher/);
  assert.match(landingNav, /LanguageSwitcher/);
});

test("ES, DE and IT messages include essential landing and navigation keys", async () => {
  for (const locale of ["es", "de", "it"]) {
    const raw = await readFile(`messages/${locale}/common.json`, "utf8");
    const messages = JSON.parse(raw);

    assert.equal(typeof messages.nav.discover, "string");
    assert.equal(typeof messages.nav.create_universe, "string");
    assert.equal(typeof messages.landing2100.hero.title, "string");
    assert.equal(typeof messages.landing2100.intentions.amour, "string");
    assert.equal(typeof messages.landing2100.discover.cta, "string");
  }
});
