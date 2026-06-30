import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

const catalog = read("src/seo/catalog.ts");
const rootPages = read("src/seo/root-pages.ts");
const metadata = read("src/seo/metadata.ts");
const seoPages = read("src/components/seo-pages.tsx");
const footer = read("src/components/layout/Footer.tsx");
const localeLayout = read("src/app/[locale]/layout.tsx");
const globalJsonLd = read("src/components/seo/GlobalJsonLd.tsx");
const sitemapData = read("src/seo/sitemap-data.ts");
const authLayout = read("src/app/[locale]/auth/layout.tsx");
const registerLayout = read("src/app/[locale]/auth/register/layout.tsx");
const membresLayoutPath = "src/app/[locale]/membres/layout.tsx";
const freemiumPage = read("src/app/[locale]/freemium/page.tsx");

const forbiddenSeoMetaCopy = [
  "Why this page exists",
  "This article targets long-tail informational search intent",
  "This guide answers informational search intent",
  "This market page explains",
  "This page explains",
  "This page details",
  "Cette page existe",
  "Cette page explique",
  "Cette page detaille",
  "Cette page détaille",
  "Cette page clarifie",
  "Cet article vise une requete longue traine",
  "Cette page cible",
  "intention SEO",
  "SEO intent",
];

for (const phrase of forbiddenSeoMetaCopy) {
  assert.ok(!catalog.includes(phrase), `catalog visible copy must not expose SEO meta-copy: ${phrase}`);
  assert.ok(!rootPages.includes(phrase), `root pages visible copy must not expose SEO meta-copy: ${phrase}`);
  assert.ok(!seoPages.includes(phrase), `SEO page UI must not expose SEO meta-copy: ${phrase}`);
}

assert.ok(authLayout.includes("robots: { index: false, follow: true }"), "auth layout must be noindex,follow");
assert.ok(registerLayout.includes("robots: { index: false, follow: true }"), "register layout must be noindex,follow");
assert.ok(existsSync(join(root, membresLayoutPath)), "membres route must have a noindex layout");
assert.ok(read(membresLayoutPath).includes("robots: { index: false, follow: true }"), "membres layout must be noindex,follow");
assert.ok(freemiumPage.includes("robots: { index: true, follow: true }"), "freemium page must stay indexable");
assert.ok(freemiumPage.length >= 12000, "freemium page must remain a substantial business-model page");

for (const snippet of [
  "COURTIA (courtiark.fr) · Embir (embir.xyz)",
  'title: { absolute: title }',
  'openGraph: {',
  'twitter: {',
]) {
  assert.ok(metadata.includes(snippet), `SEO metadata must include ${snippet}`);
}

for (const snippet of [
  'template: `%s | ${BRAND_SIGNATURE}`',
  '<meta name="description" content={siteDescription} />',
  'const siteDescription = `${t(\'description\')} ${BRAND_SIGNATURE}.`;',
]) {
  assert.ok(localeLayout.includes(snippet), `locale layout must include ${snippet}`);
}

for (const snippet of [
  "COURTIA (courtiark.fr) · Embir (embir.xyz)",
  "© 2026 embir.xyz · COURTIA (courtiark.fr).",
]) {
  assert.ok(footer.includes(snippet), `footer must include ${snippet}`);
}

for (const snippet of [
  "COURTIA (courtiark.fr) · Embir (embir.xyz)",
  "SEO and brand coordination alongside COURTIA (courtiark.fr)",
]) {
  assert.ok(globalJsonLd.includes(snippet), `global JSON-LD must include ${snippet}`);
}

for (const field of ["answerSummary?: string", "comparisonPoints?: string[]", "proofPoints?: string[]", "evidenceMetrics?: string[]", "evidenceNarrative?: string"]) {
  assert.ok(catalog.includes(field), `ResolvedSeoPage must expose ${field}`);
}

for (const field of ["answerSummary:", "comparisonPoints:", "proofPoints:", "evidenceMetrics:", "evidenceNarrative:"]) {
  assert.ok(catalog.includes(field), `comparison pages must populate ${field}`);
}

for (const marker of ["AnswerSummaryBlock", "ComparisonPointsBlock", "ProofPointsBlock", "EvidenceNarrativeBlock"]) {
  assert.ok(seoPages.includes(marker), `SEO pages must render ${marker}`);
}

for (const schemaType of ['"@type": "SoftwareApplication"', '"@type": "Product"', '"@type": "ItemList"']) {
  assert.ok(seoPages.includes(schemaType), `JSON-LD must include ${schemaType}`);
}

for (const route of [
  "/fr/comparaison/",
  "/en/comparison/",
  "/en/comparisons/",
  "/fr/tinder-vs-embir",
  "/fr/grindr-vs-embir",
  "/en/hinge-vs-embir",
]) {
  assert.ok(sitemapData.includes(route), `sitemap data must expose ${route}`);
}

for (const slug of [
  "application-rencontre-sans-faux-profils",
  "verification-selfie-rencontre",
  "application-rencontre-lgbt-securisee",
  "no-fake-profiles-dating-app",
  "selfie-verification-dating",
  "safe-lgbtq-dating-app",
]) {
  assert.ok(rootPages.includes(slug), `trust cluster root pages must include ${slug}`);
}

assert.ok(catalog.includes("2300"), "comparison evidence contract must document the 2300 character threshold");
for (const figure of ["0 EUR", "4 piliers", "2 formats", "1 comparatif", "100%"]) {
  assert.ok(catalog.includes(figure), `comparison evidence must contain figure: ${figure}`);
}

const narrativeStart = catalog.indexOf("function comparisonEvidenceNarrative");
const narrativeEnd = catalog.indexOf("export function resolveMarketCityPage", narrativeStart);
const narrativeSource = catalog.slice(narrativeStart, narrativeEnd);
const firstReturn = narrativeSource.indexOf("return [");
const firstJoin = narrativeSource.indexOf("].join(\"\\n\\n\");", firstReturn);
const secondReturn = narrativeSource.indexOf("return [", firstJoin);
const secondJoin = narrativeSource.indexOf("].join(\"\\n\\n\");", secondReturn);

function collectTemplateChars(block) {
  return [...block.matchAll(/`([\s\S]*?)`/g)]
    .map((match) => match[1].replace(/\$\{app\}/g, "Tinder").replace(/\$\{minimumLength\}/g, "2300"))
    .join("\n\n")
    .length;
}

assert.ok(collectTemplateChars(narrativeSource.slice(firstReturn, firstJoin)) >= 2300, "FR evidence narrative must be 2300+ chars");
assert.ok(collectTemplateChars(narrativeSource.slice(secondReturn, secondJoin)) >= 2300, "EN evidence narrative must be 2300+ chars");

console.log("GEO ANSWER CONTRACT: PASS");
