import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("MobileTabBar is a client component", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /["']use client["']/);
});

test("MobileTabBar respects safe-area-inset-bottom", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /safe-area-inset-bottom/);
});

test("MobileTabBar has minimum 44px touch targets", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /min-h-\[44px\]/);
  assert.match(src, /min-w-\[44px\]/);
});

test("MobileTabBar uses ember token for active state", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /e21-ember/);
  assert.match(src, /isActive/);
});

test("MobileTabBar has focus-visible styles", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /focus-visible/);
  assert.match(src, /e21-focus/);
});

test("MobileTabBar has proper navigation role and aria-label", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /role="navigation"/);
  assert.match(src, /aria-label/);
});

test("MobileTabBar sets aria-current on active tab", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /aria-current/);
  assert.match(src, /"page"/);
});

test("MobileTabBar uses touch-manipulation for mobile", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /touch-manipulation/);
});

test("MobileTabBar has backdrop blur on glass background", async () => {
  const src = await readFile("src/components/ui/MobileTabBar.tsx", "utf8");

  assert.match(src, /backdrop-blur/);
});
