import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readProjectFile = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("keeps Embir positioned as worldwide instead of market-limited", () => {
  const serialized = [
    "src/app/llms.txt/route.ts",
    "src/seo/root-pages.ts",
    "src/seo/guides-en.ts",
    "src/seo/guides-fr.ts",
    "src/seo/blog-fr.ts",
  ].map(readProjectFile).join("\n");

  const forbiddenMarketLimitedCopy = [
    /\bFrance, UK and USA\b/i,
    /\bFrance UK USA\b/i,
    /\bUS, UK, and France\b/i,
    /\bUS, UK and France\b/i,
    /\bMarkets:\s*France\b/i,
    /\b(?:US|UK|Swiss|French) founding members\b/i,
    /\bour US, UK and French founding members\b/i,
  ];

  for (const pattern of forbiddenMarketLimitedCopy) {
    assert.equal(pattern.test(serialized), false, pattern.source);
  }

  assert.match(serialized, /\bworldwide\b/i);
});
