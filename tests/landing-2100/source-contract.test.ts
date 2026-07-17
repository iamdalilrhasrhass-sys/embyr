import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("keeps the homepage server rendered", async () => {
  const page = await readFile("src/app/[locale]/page.tsx", "utf8");

  assert.match(page, /Landing2100/);
  assert.doesNotMatch(page, /["']use client["']/);
  assert.doesNotMatch(page, /FomoCounter/);
});

test("composes the approved landing chapters in order", async () => {
  const composition = await readFile(
    "src/components/landing-2100/Landing2100.tsx",
    "utf8",
  );
  const chapterOrder = [
    "HeroChapter",
    "ReciprocityChapter",
    "UniverseChapter",
    "IntentionsRail",
    "JournalIndex",
    "SeoContinuation",
  ];
  let previousIndex = -1;

  for (const chapter of chapterOrder) {
    const currentIndex = composition.lastIndexOf(`<${chapter}`);
    assert.ok(currentIndex > previousIndex, `${chapter} must follow the previous chapter`);
    previousIndex = currentIndex;
  }
});

test("keeps the hero semantic and lightweight", async () => {
  const [hero, nav, compass] = await Promise.all([
    readFile("src/components/landing-2100/HeroChapter.tsx", "utf8"),
    readFile("src/components/landing-2100/LandingNav.tsx", "utf8"),
    readFile("src/components/landing-2100/CompatibilityCompass.tsx", "utf8"),
  ]);

  assert.equal((hero.match(/<h1/g) ?? []).length, 1);
  assert.match(nav, /#compatibility/);
  assert.match(nav, /#safety/);
  assert.match(nav, /#journal/);
  assert.match(compass, /<title/);
  assert.match(compass, /aria-live="polite"/);
  assert.doesNotMatch(`${hero}${nav}${compass}`, /three|@react-three|badge|pill/i);
});

test("keeps sign-in available next to registration in both locales", async () => {
  const [nav, copy] = await Promise.all([
    readFile("src/components/landing-2100/LandingNav.tsx", "utf8"),
    readFile("src/components/landing-2100/landing-copy.ts", "utf8"),
  ]);

  assert.match(nav, /const loginPath = locale === "fr" \? "\/fr\/auth\/login" : "\/auth\/login"/);
  assert.match(nav, /href=\{loginPath\}/);
  assert.match(copy, /login: "Se connecter"/);
  assert.match(copy, /login: "Log in"/);
});

test("uses semantic controls for the reciprocity demonstration", async () => {
  const [chapter, instrument] = await Promise.all([
    readFile("src/components/landing-2100/ReciprocityChapter.tsx", "utf8"),
    readFile("src/components/landing-2100/ReciprocityInstrument.tsx", "utf8"),
  ]);

  assert.match(chapter, /id="compatibility"/);
  assert.match(instrument, /type="range"/);
  assert.match(instrument, /buildReciprocalStrands/);
  assert.match(instrument, /aria-live="polite"/);
  assert.match(instrument, /copy\.axes/);
});

test("presents the personal universe as an accessible demonstration", async () => {
  const [chapter, artifact] = await Promise.all([
    readFile("src/components/landing-2100/UniverseChapter.tsx", "utf8"),
    readFile("src/components/landing-2100/UniverseArtifact.tsx", "utf8"),
  ]);

  assert.match(chapter, /from "next\/image"/);
  assert.match(chapter, /alt=\{copy\.demoNotice\}/);
  assert.match(artifact, /role="tablist"/);
  assert.match(artifact, /role="tab"/);
  assert.match(artifact, /aria-selected/);
  assert.match(artifact, /copy\.demoNotice/);
});

test("renders intentions, journal and SEO links without invented metadata", async () => {
  const [intentions, journal, seo] = await Promise.all([
    readFile("src/components/landing-2100/IntentionsRail.tsx", "utf8"),
    readFile("src/components/landing-2100/JournalIndex.tsx", "utf8"),
    readFile("src/components/landing-2100/SeoContinuation.tsx", "utf8"),
  ]);

  assert.match(intentions, /copy\.items\.map/);
  assert.match(intentions, /aria-selected/);
  assert.match(journal, /copy\.items\.map/);
  assert.doesNotMatch(journal, /author|articleCount|rating/i);
  assert.match(seo, /copy\.intentions/);
  assert.match(seo, /copy\.orientations/);
  assert.match(seo, /copy\.cities/);
  assert.match(seo, /copy\.faq/);
  assert.match(seo, /FAQPage/);
});

test("treats analytics persistence as non-critical", async () => {
  const route = await readFile("src/app/api/analytics/track/route.ts", "utf8");

  assert.match(route, /status:\s*202/);
  assert.doesNotMatch(route, /status:\s*500/);
});
