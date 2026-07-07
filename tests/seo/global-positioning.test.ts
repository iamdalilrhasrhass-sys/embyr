import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const readProjectFile = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const listProjectFiles = (dir: string): string[] => {
  const entries = readdirSync(new URL(`../../${dir}`, import.meta.url), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = `${dir}/${entry.name}`;
    return entry.isDirectory() ? listProjectFiles(path) : [path];
  });
};
const messageFiles = readdirSync(new URL("../../messages", import.meta.url))
  .map((locale) => `messages/${locale}/common.json`);
const seoContentFiles = listProjectFiles("src/seo/content")
  .filter((path) => path.endsWith(".json"));

test("keeps Embir positioned as worldwide instead of market-limited", () => {
  const serialized = [
    "src/app/llms.txt/route.ts",
    "src/components/seo/GlobalJsonLd.tsx",
    "src/components/seo/SchemaOrg.tsx",
    "src/components/seo-pages.tsx",
    "src/app/[locale]/auth/register/page.tsx",
    "src/app/[locale]/faq/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/seo/root-pages.ts",
    "src/seo/guides-en.ts",
    "src/seo/guides-fr.ts",
    "src/seo/blog-fr.ts",
    ...messageFiles,
    ...seoContentFiles,
  ].map(readProjectFile).join("\n");

  const forbiddenMarketLimitedCopy = [
    /\bFrance, UK and USA\b/i,
    /\bFrance UK USA\b/i,
    /\bFrance, UK, US & Switzerland\b/i,
    /\bFrance, Suisse, UK & US\b/i,
    /\bFrance · Suisse · UK · US\b/i,
    /\bFrance · Switzerland · UK · US\b/i,
    /\bUS, UK, and France\b/i,
    /\bUS, UK and France\b/i,
    /\bfounding (?:community|members) in France\b/i,
    /\bcommunaut[eé] fondatrice en France\b/i,
    /\bMarkets:\s*France\b/i,
    /\bD'autres pays suivront\b/i,
    /\bMore countries will follow\b/i,
    /\bBuilt for France, the UK and the United States\b/i,
    /\bBuilt for France, Switzerland, the UK and the United States\b/i,
    /\bfor France, Switzerland, the UK, and the United States\b/i,
    /\bFrance, Suisse, UK et USA\b/i,
    /\bEmbir launched in France, UK, and USA\b/i,
    /\bEmbir launched simultaneously in France, UK, and USA\b/i,
    /\bFrance, UK, USA \+ expanding\b/i,
    /\bEmbir launched in (?:the UK|the USA|France|Switzerland) as (?:one of its primary markets|a primary market)\b/i,
    /\bEmbir is launching in the US, France, and UK\b/i,
    /\bEmbir is launching in France, Switzerland, the UK and the US\b/i,
    /\bEmbir est lanc[eé]e en France, en Suisse, au Royaume-Uni et aux [ÉE]tats-Unis\b/i,
    /\bEmbir's launch strategy prioritizes France\b/i,
    /\b(?:US|UK|Swiss|French) founding members\b/i,
    /\bour US, UK and French founding members\b/i,
  ];

  for (const pattern of forbiddenMarketLimitedCopy) {
    assert.equal(pattern.test(serialized), false, pattern.source);
  }

  assert.match(serialized, /\bworldwide\b/i);
});
