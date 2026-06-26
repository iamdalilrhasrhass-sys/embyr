import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeDiscoveryQuery,
  toPublicPreview,
} from "../../src/lib/discovery-preview.ts";

test("normalizes bounded visitor input", () => {
  assert.deepEqual(
    normalizeDiscoveryQuery({
      gender: " HOMME ",
      seeking: "femme",
      intent: "amour",
      city: "  Paris  ",
    }),
    { gender: "homme", seeking: "femme", intent: "AMOUR", city: "Paris" },
  );
});

test("normalizes unknown visitor input to safe defaults", () => {
  assert.deepEqual(
    normalizeDiscoveryQuery({
      gender: "robot",
      seeking: "robot",
      intent: "unknown",
      city: "\u0000  Genève    rive gauche ".repeat(6),
    }),
    {
      gender: "",
      seeking: "",
      intent: "",
      city: "Genève rive gauche Genève rive gauche Genève rive gauche Genève rive gauche Genève r",
    },
  );
});

test("maps a real profile to a non-identifying preview", () => {
  const preview = toPublicPreview({
    id: "profile-secret",
    age: 29,
    city: "Paris",
    intentions: ["AMOUR"],
  });

  assert.deepEqual(Object.keys(preview).sort(), [
    "ageBand",
    "cityLabel",
    "intentLabel",
    "visualSeed",
  ]);
  assert.deepEqual(preview, {
    ageBand: "25–34",
    cityLabel: "Paris",
    intentLabel: "Amour",
    visualSeed: preview.visualSeed,
  });
  assert.equal(Number.isInteger(preview.visualSeed), true);
  assert.ok(preview.visualSeed >= 0 && preview.visualSeed <= 999);
  assert.doesNotMatch(JSON.stringify(preview), /profile-secret|displayName|username|description|verified|premium/i);
});

test("maps missing profile details to honest generic labels", () => {
  const preview = toPublicPreview({
    id: "abc",
    age: null,
    city: null,
    intentions: [],
  });
  assert.equal(preview.ageBand, "25–34");
  assert.equal(preview.cityLabel, "Ville non précisée");
  assert.equal(preview.intentLabel, "Rencontre");
});

