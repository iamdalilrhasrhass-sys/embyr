import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReciprocalStrands,
  clamp01,
  compassPetalPath,
  reciprocalStrength,
} from "../../src/components/landing-2100/geometry.ts";

test("clamps interactive values into the supported range", () => {
  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(0.4), 0.4);
  assert.equal(clamp01(2), 1);
});

test("builds stable reciprocal strands", () => {
  const strands = buildReciprocalStrands({
    orientation: 0.5,
    intention: 0.7,
    affinity: 0.4,
  });

  assert.equal(strands.length, 12);
  assert.match(strands[0].leftPath, /^M /);
  assert.match(strands[0].rightPath, /^M /);
  assert.ok(strands.every((strand) => strand.opacity >= 0.12 && strand.opacity <= 1));
  assert.deepEqual(
    strands,
    buildReciprocalStrands({ orientation: 0.5, intention: 0.7, affinity: 0.4 }),
  );
});

test("requires both directions for a strong reciprocal core", () => {
  assert.ok(reciprocalStrength(0.9, 0.9) > reciprocalStrength(0.9, 0.1));
  assert.equal(reciprocalStrength(1, 0), 0);
});

test("generates four distinct compass petals", () => {
  const petals = Array.from({ length: 4 }, (_, index) => compassPetalPath(index, 0.2));
  assert.equal(new Set(petals).size, 4);
  assert.ok(petals.every((path) => path.startsWith("M ")));
});
