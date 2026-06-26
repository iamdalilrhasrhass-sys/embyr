import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  INDEXABLE_PROGRAMMATIC_CITIES,
  isProgrammaticIndexable,
  qualifiedProgrammaticParams,
} from "../../src/seo/programmatic-policy.ts";

test("programmatic SEO policy limits the pilot to 72 French intent-city pages", () => {
  assert.equal(INDEXABLE_PROGRAMMATIC_CITIES.length, 12);
  assert.equal(qualifiedProgrammaticParams().length, 72);
  assert.equal(isProgrammaticIndexable("fr", "amour", "paris"), true);
  assert.equal(isProgrammaticIndexable("en", "amour", "paris"), false);
  assert.equal(isProgrammaticIndexable("fr", "amour", "chicago"), false);
  assert.equal(isProgrammaticIndexable("fr", "unknown", "paris"), false);
});

test("sitemap consumes the shared qualified programmatic params", async () => {
  const source = await readFile("src/app/sitemap.ts", "utf8");
  assert.match(source, /qualifiedProgrammaticParams/);
  assert.doesNotMatch(source, /for \(const city of SEO_CITIES\)/);
});

test("programmatic route uses policy-driven static params and robots", async () => {
  const source = await readFile("src/app/[locale]/rencontre/[slug]/[city]/page.tsx", "utf8");
  assert.match(source, /qualifiedProgrammaticParams/);
  assert.match(source, /isProgrammaticIndexable/);
  assert.match(source, /robots:\s*isIndexable\s*\?\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/s);
  assert.match(source, /index:\s*false,\s*follow:\s*true/);
  assert.doesNotMatch(source, /Profils verifies|100% gratuit|100% free|No subscription|no subscription|no ads|aucune pub|selfie verification/i);
});

