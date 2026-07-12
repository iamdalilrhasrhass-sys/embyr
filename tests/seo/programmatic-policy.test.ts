import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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

test("public Embir copy rejects unsupported trust, growth, and AI claims", async () => {
  const roots = ["src/app", "src/components", "src/seo", "messages"];
  const files = ["README.md"];

  for (const root of roots) {
    const entries = await readdir(root, { recursive: true });
    files.push(
      ...entries
        .filter((entry) => /\.(?:ts|tsx|json)$/.test(entry))
        .map((entry) => `${root}/${entry}`),
    );
  }

  const forbidden = [
    /chaque (?:membre|profil)(?: sur Embir)? est vérifié/i,
    /every (?:member|profile) (?:is verified|verifies|goes through)/i,
    /mandatory (?:profile )?verification/i,
    /(?:zéro|zero) faux profil/i,
    /no fake profiles/i,
    /(?:matching IA|AI-powered matching)/i,
    /every report (?:is )?reviewed by (?:a )?(?:human|person|team member)/i,
    /(?:5,013|5,000\+|2,480|90% des profils)/i,
    /(?:anti-ghosting|25 languages|25 langues)/i,
    /(?:communautés actives|active communities|growing fastest)/i,
    /(?:messagerie illimitée|unlimited messaging|unlimited likes)/i,
  ];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const claim of forbidden) {
      assert.doesNotMatch(source, claim, `${file}: ${claim}`);
    }
  }
});
