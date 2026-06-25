import assert from "node:assert/strict";
import test from "node:test";
import { stepSpring, applyFriction, clampTilt, tickPhysics, createPhysicsState } from "../../src/components/landing-2100/compass-physics.ts";

test("applyFriction reduces absolute velocity", () => {
  assert.ok(Math.abs(applyFriction(10, 0.92)) < 10);
  assert.ok(Math.abs(applyFriction(-5, 0.92)) < 5);
});

test("applyFriction with friction=1 preserves velocity", () => {
  assert.strictEqual(applyFriction(10, 1), 10);
  assert.strictEqual(applyFriction(-3, 1), -3);
});

test("applyFriction with friction=0 eliminates velocity", () => {
  assert.strictEqual(applyFriction(100, 0), 0);
});

test("clampTilt bounds to ±maxDeg", () => {
  assert.strictEqual(clampTilt(25, 18), 18);
  assert.strictEqual(clampTilt(-25, 18), -18);
  assert.strictEqual(clampTilt(10, 18), 10);
  assert.strictEqual(clampTilt(0, 18), 0);
});

test("stepSpring converges toward target over time", () => {
  let state = { angle: 0, velocity: 5 };
  const target = 1;
  const previousDistance = Math.abs(state.angle - target);
  for (let i = 0; i < 50; i++) state = stepSpring(state, target, 1);
  assert.ok(Math.abs(state.angle - target) < previousDistance);
});

test("stepSpring does not oscillate to infinity", () => {
  let state = { angle: 0, velocity: 20 };
  for (let i = 0; i < 200; i++) {
    state = stepSpring(state, 0, 1);
    assert.ok(Math.abs(state.angle) < 1000);
    assert.ok(Math.abs(state.velocity) < 1000);
  }
  assert.ok(Math.abs(state.angle) < 0.5);
  assert.ok(Math.abs(state.velocity) < 0.5);
});

test("stepSpring converges to target from rest", () => {
  const targets = [0, 0.3, -0.2, 1.5, -1.0];
  for (const target of targets) {
    let state = { angle: 0, velocity: 0 };
    for (let i = 0; i < 100; i++) state = stepSpring(state, target, 1);
    assert.ok(Math.abs(state.angle - target) < 0.01, `angle=${state.angle} target=${target}`);
  }
});

test("tickPhysics advances state without exploding", () => {
  const s = createPhysicsState(0.1);
  s.velocity = 10;
  s.targetAngle = 0.5;
  for (let i = 0; i < 200; i++) {
    tickPhysics(s);
    assert.ok(Math.abs(s.angle) < 100);
    assert.ok(Math.abs(s.velocity) < 100);
  }
});

test("tickPhysics reduced motion snaps directly", () => {
  const s = createPhysicsState(0.1);
  s.targetAngle = 1.5;
  s.targetTiltX = 10;
  tickPhysics(s, 0.92, true);
  assert.strictEqual(s.angle, s.targetAngle);
  assert.strictEqual(s.velocity, 0);
  assert.strictEqual(s.tiltX, s.targetTiltX);
});
