import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("homepage exposes all five public landing locales through hreflang and sitemap", async () => {
  const sitemapSource = await readFile("src/app/sitemap.ts", "utf8");
  const urlSource = await readFile("src/seo/url.ts", "utf8");

  for (const locale of ["fr", "es", "de", "it"]) {
    assert.match(sitemapSource, new RegExp(`baseUrl}/` + locale));
    assert.match(urlSource, new RegExp(`"${locale}"`));
  }
  assert.match(urlSource, /fr-FR/);
  assert.match(urlSource, /x-default/);
});

test("home page owns landing metadata instead of inheriting a two-locale layout fallback", async () => {
  const source = await readFile("src/app/[locale]/page.tsx", "utf8");

  assert.match(source, /generateMetadata/);
  assert.match(source, /landingMetadataByLocale/);
  assert.match(source, /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/s);
});

test("casual and straight dating have dedicated money pages, not blank home fallbacks", async () => {
  const rootPages = await readFile("src/seo/root-pages.ts", "utf8");
  const config = await readFile("next.config.ts", "utf8");

  assert.match(rootPages, /"casual-dating"[\s\S]*Casual dating with clarity, consent and compatibility/);
  assert.match(rootPages, /"straight-dating"[\s\S]*Straight dating that respects intention and compatibility/);
  assert.match(rootPages, /"rencontre-casual"[\s\S]*Rencontre casual : claire, consentie, compatible/);
  assert.match(rootPages, /"rencontre-hetero"[\s\S]*Rencontre hétéro : intention claire et vraie compatibilité/);
  assert.match(config, /source:\s*"\/fr\/casual-dating"[\s\S]*destination:\s*"\/fr\/rencontre-casual"/);
  assert.match(config, /source:\s*"\/fr\/straight-dating"[\s\S]*destination:\s*"\/fr\/rencontre-hetero"/);
});

test("legacy Marseille and Metz pages keep French canonicals and avoid unproven claims", async () => {
  for (const file of [
    "src/app/[locale]/rencontre/marseille/page.tsx",
    "src/app/[locale]/rencontre/metz/page.tsx",
  ]) {
    const source = await readFile(file, "utf8");

    assert.match(source, /canonical:\s*"https:\/\/embir\.xyz\/fr\/rencontre\/(marseille|metz)"/);
    assert.doesNotMatch(source, /100%\s*gratuit|100%\s*free|z[ée]ro pub|zero ads|matching IA|AI matching|Chaque profil .*v[ée]rifi/i);
    assert.match(source, /Gratuit au lancement/);
  }
});
