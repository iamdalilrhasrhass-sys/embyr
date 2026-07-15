import assert from "node:assert/strict";
import test from "node:test";
import { isFirstPartyEmailAddress } from "../../src/lib/email-address-policy.ts";
import { validateRegistrationInput } from "../../src/lib/registration.ts";

const validInput = {
  password: "correct-horse",
  isAdult: true,
  acceptTerms: true,
  acceptPrivacy: true,
};

test("brand-owned email addresses are reserved for internal operations", () => {
  assert.equal(isFirstPartyEmailAddress("owner@embir.xyz"), true);
  assert.equal(isFirstPartyEmailAddress("person@gmail.com"), false);
  const result = validateRegistrationInput({
    ...validInput,
    email: "legacy@embir.xyz",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "email_domain_reserved");
});

test("external adult registrations remain accepted", () => {
  const result = validateRegistrationInput({
    ...validInput,
    email: "person@example.ch",
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.email, "person@example.ch");
});
