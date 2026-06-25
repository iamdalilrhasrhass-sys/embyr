import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Input has minimum height of 48px", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /min-h-\[48px\]/);
});

test("Input uses dark glass background with e21 tokens", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /e21-line/);
  assert.match(src, /rgba\(242,237,228,0\.03\)/);
  assert.match(src, /e21-bone/);
});

test("Input has error state with coral token and role alert", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /error/);
  assert.match(src, /e21-coral/);
  assert.match(src, /role="alert"/);
  assert.match(src, /aria-invalid/);
});

test("Input has focus-within state using ember token", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /focus-within:border-\[var\(--e21-ember\)\]/);
});

test("Input supports label with required asterisk", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /label/);
  assert.match(src, /htmlFor/);
  assert.match(src, /required/);
});

test("Input has leftSlot and rightSlot support", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /leftSlot/);
  assert.match(src, /rightSlot/);
});

test("Input has proper aria-describedby for error and helper", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /aria-describedby/);
  assert.match(src, /\$\{inputId\}-error/);
  assert.match(src, /\$\{inputId\}-helper/);
});

test("Input has disabled state", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.match(src, /disabled:cursor-not-allowed/);
});

test("Input has no 'use client' directive", async () => {
  const src = await readFile("src/components/ui/Input.tsx", "utf8");

  assert.doesNotMatch(src, /["']use client["']/);
});
