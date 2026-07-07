import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  LOCALE_COOKIE,
  LOCALE_SOURCE_COOKIE,
  buildLocalizedPath,
  detectLocaleFromRequest,
  getLocaleFromPathname,
} from "../../src/i18n/locale-detection.ts";

const headers = (values: Record<string, string>) => new Headers(values);

test("detects the public language from country headers, browser language, then cookie fallback", () => {
  assert.equal(
    detectLocaleFromRequest({
      cookies: new Map(),
      headers: headers({ "x-vercel-ip-country": "FR" }),
      pathname: "/",
    }),
    "fr",
  );
  assert.equal(
    detectLocaleFromRequest({
      cookies: new Map(),
      headers: headers({ "cf-ipcountry": "US", "accept-language": "fr-FR,fr;q=0.9" }),
      pathname: "/",
    }),
    "en",
  );
  assert.equal(
    detectLocaleFromRequest({
      cookies: new Map(),
      headers: headers({ "accept-language": "fr-CA,fr;q=0.9,en;q=0.4" }),
      pathname: "/",
    }),
    "fr",
  );
  assert.equal(
    detectLocaleFromRequest({
      cookies: new Map([[LOCALE_COOKIE, "fr"]]),
      headers: headers({}),
      pathname: "/",
    }),
    "fr",
  );
  assert.equal(
    detectLocaleFromRequest({
      cookies: new Map([
        [LOCALE_COOKIE, "en"],
        [LOCALE_SOURCE_COOKIE, "auto"],
      ]),
      headers: headers({ "x-vercel-ip-country": "FR" }),
      pathname: "/",
    }),
    "fr",
  );
});

test("explicit manual language selection wins over geolocation", () => {
  const cookies = new Map([
    [LOCALE_COOKIE, "en"],
    [LOCALE_SOURCE_COOKIE, "manual"],
  ]);

  assert.equal(
    detectLocaleFromRequest({
      cookies,
      headers: headers({ "x-vercel-ip-country": "FR", "accept-language": "fr-FR" }),
      pathname: "/fr",
    }),
    "en",
  );
});

test("builds canonical localized paths for the top language switcher", () => {
  assert.equal(buildLocalizedPath("/", "fr"), "/fr");
  assert.equal(buildLocalizedPath("/", "en"), "/");
  assert.equal(buildLocalizedPath("/fr/amour", "en"), "/amour");
  assert.equal(buildLocalizedPath("/amour", "fr"), "/fr/amour");
  assert.equal(buildLocalizedPath("/fr/blog/test?utm=1#top", "en"), "/blog/test?utm=1#top");
});

test("reads the locale from prefixed paths only", () => {
  assert.equal(getLocaleFromPathname("/fr"), "fr");
  assert.equal(getLocaleFromPathname("/fr/amour"), "fr");
  assert.equal(getLocaleFromPathname("/en"), "en");
  assert.equal(getLocaleFromPathname("/embir"), null);
});

test("wires detection through proxy and the visible language switcher", async () => {
  const [proxy, switcher, landingNav] = await Promise.all([
    readFile("src/proxy.ts", "utf8"),
    readFile("src/components/LanguageSwitcher.tsx", "utf8"),
    readFile("src/components/landing-2100/LandingNav.tsx", "utf8"),
  ]);

  assert.match(proxy, /detectLocaleFromRequest/);
  assert.match(proxy, /LOCALE_COOKIE/);
  assert.match(proxy, /NextResponse\.redirect/);
  assert.match(switcher, /buildLocalizedPath/);
  assert.match(switcher, /LOCALE_SOURCE_COOKIE/);
  assert.match(switcher, /aria-expanded/);
  assert.match(landingNav, /LanguageSwitcher/);
});
