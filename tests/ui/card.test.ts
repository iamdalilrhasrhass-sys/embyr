import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Card uses glass styling with e21-line border and translucent background", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.match(src, /border-\[var\(--e21-line\)\]/);
  assert.match(src, /rgba\(255,255,255,0\.02\)/);
  assert.match(src, /backdrop-blur/);
});

test("Card uses eb-radius-lg (24px) for rounded corners", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.match(src, /--eb-radius-lg/);
});

test("Card supports optional header slot", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.match(src, /header/);
});

test("Card supports optional footer slot", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.match(src, /footer/);
});

test("Card header and footer are separated by e21-line borders", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.match(src, /border-b.*e21-line/);
  assert.match(src, /border-t.*e21-line/);
});

test("Card has overflow hidden for rounded corner containment", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.match(src, /overflow-hidden/);
});

test("Card has no 'use client' directive", async () => {
  const src = await readFile("src/components/ui/Card.tsx", "utf8");

  assert.doesNotMatch(src, /["']use client["']/);
});
