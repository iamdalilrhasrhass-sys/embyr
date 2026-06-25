import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Badge has three variants: amber, coral, muted", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /amber/);
  assert.match(src, /coral/);
  assert.match(src, /muted/);
});

test("Badge uses pill shape with rounded-full", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /rounded-full/);
});

test("Badge amber variant uses e21-ember token", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /e21-ember/);
});

test("Badge coral variant uses e21-coral token", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /e21-coral/);
});

test("Badge uses uppercase and tracking-wide for label style", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /uppercase/);
  assert.match(src, /tracking-wide/);
});

test("Badge renders colored dot indicators for amber and coral variants", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /rounded-full bg-\[var\(--e21-ember/);
  assert.match(src, /rounded-full bg-\[var\(--e21-coral/);
});

test("Badge uses semantic HTML span element", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /<span/);
});

test("Badge dot indicators have aria-hidden", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.match(src, /aria-hidden="true"/);
});

test("Badge has no 'use client' directive", async () => {
  const src = await readFile("src/components/ui/Badge.tsx", "utf8");

  assert.doesNotMatch(src, /["']use client["']/);
});
