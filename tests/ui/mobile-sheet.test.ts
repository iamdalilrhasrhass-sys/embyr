import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("MobileSheet is a client component", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /["']use client["']/);
});

test("MobileSheet uses dialog role with aria-modal", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /role="dialog"/);
  assert.match(src, /aria-modal/);
});

test("MobileSheet has backdrop with blur", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /backdrop-blur/);
  assert.match(src, /bg-black\/60/);
});

test("MobileSheet respects safe-area-inset-bottom", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /safe-area-inset-bottom/);
});

test("MobileSheet closes on Escape key", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /key.*===.*"Escape"/);
  assert.match(src, /onClose/);
});

test("MobileSheet uses e21 design tokens", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /e21-line/);
  assert.match(src, /e21-void/);
});

test("MobileSheet animates slide-up from bottom", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /slideUp/);
});

test("MobileSheet traps focus and manages body scroll lock", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /tabIndex=\{-1\}/);
  assert.match(src, /body\.style\.overflow/);
});

test("MobileSheet saves and restores previous focus", async () => {
  const src = await readFile("src/components/ui/MobileSheet.tsx", "utf8");

  assert.match(src, /previousFocus/);
  assert.match(src, /\.focus\(\)/);
});
