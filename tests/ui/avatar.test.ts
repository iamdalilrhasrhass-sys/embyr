import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Avatar has four sizes: sm(32), md(44), lg(64), xl(96)", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.match(src, /sm.*32/);
  assert.match(src, /md.*44/);
  assert.match(src, /lg.*64/);
  assert.match(src, /xl.*96/);
});

test("Avatar minimum touch target is 44px (md size)", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");
  // The md size is 44px which is ≥ 44px
  assert.match(src, /md: 44/);
});

test("Avatar generates initials from alt text when no fallback", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.match(src, /initials/);
  assert.match(src, /split/);
  assert.match(src, /toUpperCase/);
});

test("Avatar renders img element when src is provided", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.match(src, /<img/);
  assert.match(src, /loading="lazy"/);
});

test("Avatar has online status dot with coral token", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.match(src, /isOnline/);
  assert.match(src, /e21-coral/);
  assert.match(src, /role="status"/);
  assert.match(src, /"En ligne"/);
});

test("Avatar uses e21 design tokens", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.match(src, /e21-raised/);
  assert.match(src, /e21-line/);
  assert.match(src, /e21-bone/);
  assert.match(src, /e21-void/);
});

test("Avatar has role img with aria-label for accessibility", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.match(src, /role="img"/);
  assert.match(src, /aria-label=\{alt\}/);
});

test("Avatar has no 'use client' directive", async () => {
  const src = await readFile("src/components/ui/Avatar.tsx", "utf8");

  assert.doesNotMatch(src, /["']use client["']/);
});
