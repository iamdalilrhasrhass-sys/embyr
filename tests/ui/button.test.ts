import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Button renders with ember primary variant by default", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.match(src, /export default function Button/);
  assert.match(src, /variant.*=.*"primary"/);
  assert.match(src, /e21-ember/);
});

test("Button has all four variants: primary, secondary, ghost, danger", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.match(src, /primary/);
  assert.match(src, /secondary/);
  assert.match(src, /ghost/);
  assert.match(src, /danger/);
});

test("Button has three sizes: sm (44px), md (48px), lg (56px)", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.match(src, /sm.*min-h-\[44px\]/);
  assert.match(src, /md.*min-h-\[48px\]/);
  assert.match(src, /lg.*min-h-\[56px\]/);
});

test("Button has focus-visible ring using e21-focus token", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.match(src, /focus-visible/);
  assert.match(src, /e21-focus/);
  assert.match(src, /outline-offset/);
});

test("Button has disabled state with reduced opacity and cursor", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.match(src, /disabled:cursor-not-allowed/);
  assert.match(src, /disabled:opacity/);
});

test("Button uses touch-manipulation for mobile", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.match(src, /touch-manipulation/);
});

test("Button has no 'use client' directive", async () => {
  const src = await readFile("src/components/ui/Button.tsx", "utf8");

  assert.doesNotMatch(src, /["']use client["']/);
});
