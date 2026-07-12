import test from "node:test";
import assert from "node:assert/strict";
import { resolveMarketCityPage, resolveMarketLandingPage, staticParams } from "../../src/seo/catalog.ts";
import { seoEntries } from "../../src/seo/sitemap-data.ts";
import { buildLanguageAlternates } from "../../src/seo/url.ts";

test("resolves Swiss landing and city pages in English and French", () => {
  const englishLanding = resolveMarketLandingPage("switzerland", "en");
  const frenchLanding = resolveMarketLandingPage("switzerland", "fr");
  const zurich = resolveMarketCityPage("switzerland", "zurich", "en");
  const geneva = resolveMarketCityPage("switzerland", "geneve", "fr");

  assert.equal(englishLanding?.h1, "Dating in Switzerland — core connections without a credit card");
  assert.equal(frenchLanding?.h1, "Application de rencontre gratuite en Suisse — Genève, Lausanne, Zurich");
  assert.equal(zurich?.city, "Zurich");
  assert.equal(geneva?.city, "Geneve");
  assert.ok(staticParams.switzerland.some((item) => item.locale === "fr" && item.slug === "geneve"));
});

test("exposes Swiss URLs in sitemap data and hreflang alternates", () => {
  const paths = seoEntries.map((entry) => entry.path);
  const alternates = buildLanguageAlternates("/switzerland/zurich");

  assert.ok(paths.includes("/en/switzerland"));
  assert.ok(paths.includes("/fr/suisse"));
  assert.ok(paths.includes("/en/switzerland/zurich"));
  assert.ok(paths.includes("/fr/suisse/geneve"));
  assert.equal(alternates["en-CH"], "https://embir.xyz/switzerland/zurich");
  assert.equal(alternates["fr-CH"], "https://embir.xyz/fr/suisse/zurich");
  assert.equal(alternates["x-default"], "https://embir.xyz/switzerland/zurich");
});
