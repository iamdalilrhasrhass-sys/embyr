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
