import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCALE_COOKIE,
  SWITCHER_LOCALES,
  detectSupportedLocale,
  localizePathname,
  pickPreferredLocale,
} from "../../src/i18n/locale-detection.ts";

test("detects the five public switcher locales from Accept-Language", () => {
  assert.deepEqual(SWITCHER_LOCALES, ["fr", "en", "es", "de", "it"]);
  assert.equal(detectSupportedLocale("es-ES,es;q=0.9,en;q=0.8"), "es");
  assert.equal(detectSupportedLocale("de-CH,de;q=0.8,fr;q=0.7"), "de");
  assert.equal(detectSupportedLocale("it;q=0.6,fr;q=0.8,de;q=0.9"), "de");
  assert.equal(detectSupportedLocale("pt-BR,ar;q=0.8"), "en");
  assert.equal(detectSupportedLocale(null), "en");
});

test("manual locale cookie wins over browser detection", () => {
  assert.equal(LOCALE_COOKIE, "embir_locale");
  assert.equal(
    pickPreferredLocale({ cookieLocale: "fr", acceptLanguage: "es-ES,es;q=0.9" }),
    "fr",
  );
  assert.equal(
    pickPreferredLocale({ cookieLocale: "xx", acceptLanguage: "es-ES,es;q=0.9" }),
    "es",
  );
});

test("switches locale prefixes without duplicating path segments", () => {
  assert.equal(localizePathname("/", "es"), "/es");
  assert.equal(localizePathname("/fr/decouvrir", "it"), "/it/decouvrir");
  assert.equal(localizePathname("/decouvrir", "fr"), "/fr/decouvrir");
  assert.equal(localizePathname("/es", "en"), "/");
  assert.equal(localizePathname("/de/rencontre/amour/paris", "en"), "/rencontre/amour/paris");
  assert.equal(localizePathname("/pt/decouvrir", "fr"), "/fr/decouvrir");
});
