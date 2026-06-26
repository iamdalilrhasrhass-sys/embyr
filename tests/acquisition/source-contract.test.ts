import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("discovery preview API never imports fabricated data or identifying profile fields", async () => {
  const source = await readFile("src/app/api/discovery-preview/route.ts", "utf8");
  assert.doesNotMatch(source, /MOCK_PROFILES|mockData|DEMO_PROFILES/i);
  assert.match(source, /toPublicPreview/);
  assert.match(source, /take:\s*6/);
  assert.match(source, /publicVisibility:\s*true/);
  assert.doesNotMatch(source, /displayName:\s*true|username:\s*true|description:\s*true|isVerified:\s*true|isPremium:\s*true|onlineStatus:\s*true|lastSeenAt:\s*true|media:\s*true|url:\s*true/);
});

test("discovery page is localized, noindexed, and delegates UI to the acquisition experience", async () => {
  const page = await readFile("src/app/[locale]/decouvrir/page.tsx", "utf8");
  assert.match(page, /DiscoveryExperience/);
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/s);
  assert.match(page, /Découvrez des profils compatibles, sans vous inscrire d’abord/);
  assert.match(page, /Explore compatible profiles before you sign up/);
});

test("discovery experience has honest states and no anonymous like/favorite actions", async () => {
  const source = await readFile("src/components/acquisition/DiscoveryExperience.tsx", "utf8");
  const copy = await readFile("src/components/acquisition/discovery-copy.ts", "utf8");
  const combined = `${source}\n${copy}`;
  assert.match(combined, /Aperçus anonymisés/);
  assert.match(combined, /profils réellement publiés/);
  assert.match(combined, /Embir se construit ville par ville/);
  assert.match(combined, /temporairement indisponible/);
  assert.match(source, /aria-live/);
  assert.doesNotMatch(combined, /favorites|like|Pass|MOCK_PROFILES|DEMO_PROFILES/i);
});

test("landing primary CTA routes through localized discovery", async () => {
  const hero = await readFile("src/components/landing-2100/HeroChapter.tsx", "utf8");
  const landing = await readFile("src/components/landing-2100/Landing2100.tsx", "utf8");
  assert.match(hero, /discoveryHref/);
  assert.match(hero, /href=\{discoveryHref\}/);
  assert.match(landing, /locale=\{locale\}/);
});
