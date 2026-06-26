import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  resetUniverseTilt,
  tiltFromPointerDelta,
} from "../../src/components/landing-2100/universe-tilt.ts";

test("maps pointer delta to bounded tilt", () => {
  assert.deepEqual(tiltFromPointerDelta(500, -500), { x: 12, y: 12 });
  assert.deepEqual(tiltFromPointerDelta(-500, 500), { x: -12, y: -12 });
  assert.deepEqual(tiltFromPointerDelta(20, 10), { x: 2, y: -1 });
});

test("resets universe tilt to rest", () => {
  assert.deepEqual(resetUniverseTilt(), { x: 0, y: 0 });
});

test("UniverseArtifact handles mouse and touch with pointer capture", async () => {
  const source = await readFile("src/components/landing-2100/UniverseArtifact.tsx", "utf8");
  assert.match(source, /setPointerCapture/);
  assert.match(source, /releasePointerCapture/);
  assert.match(source, /onPointerCancel/);
  assert.match(source, /data-dragging/);
  assert.doesNotMatch(source, /pointerType\s*===\s*["']touch["']/);
});

