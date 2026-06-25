import test from "node:test";
import assert from "node:assert/strict";
import { landingCopy } from "../../src/components/landing-2100/landing-copy.ts";

test("locks the approved bilingual hero promise", () => {
  assert.equal(landingCopy.fr.hero.title, "Rencontrez ceux qui vous cherchent aussi.");
  assert.equal(landingCopy.en.hero.title, "Meet the people who are looking for you too.");
  assert.deepEqual(
    landingCopy.fr.intentions.items.map((item) => item.label),
    ["Amour", "Amitié", "Casual", "Sport", "Sorties", "Conversation"],
  );
});

test("contains no unsupported growth claims", () => {
  const serialized = JSON.stringify(landingCopy).toLowerCase();
  const forbiddenClaims = [
    "100% gratuit",
    "free forever",
    "profils vérifiés",
    "verified profiles",
    "5,013",
    "largest",
  ];

  for (const claim of forbiddenClaims) {
    assert.equal(serialized.includes(claim), false, claim);
  }
});

test("keeps the public discovery graph substantial and truthful", () => {
  for (const locale of ["fr", "en"] as const) {
    const copy = landingCopy[locale];
    assert.equal(copy.intentions.items.length, 6);
    assert.equal(copy.journal.items.length, 3);
    assert.ok(copy.seo.intentions.length >= 6);
    assert.ok(copy.seo.orientations.length >= 5);
    assert.ok(copy.seo.cities.length >= 6);
    assert.equal(copy.seo.faq.length, 3);
    assert.ok(copy.seo.intentions.every((item) => item.href.startsWith("/")));
  }
});
