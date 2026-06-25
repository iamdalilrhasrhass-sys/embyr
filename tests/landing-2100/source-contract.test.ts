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
