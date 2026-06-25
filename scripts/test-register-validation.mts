import assert from "node:assert/strict";
import { validateRegistrationInput } from "../src/lib/register-validation.ts";

const validInput = {
  email: "test@example.com",
  password: "strong-password",
  isAdult: true,
  acceptTerms: true,
};

assert.deepEqual(validateRegistrationInput(validInput), {
  ok: true,
  value: {
    email: "test@example.com",
    password: "strong-password",
    isAdult: true,
    acceptTerms: true,
  },
});

assert.deepEqual(
  validateRegistrationInput({ ...validInput, isAdult: false }),
  { ok: false, status: 400, code: "adult_confirmation_required" },
);

assert.deepEqual(
  validateRegistrationInput({ ...validInput, acceptTerms: false }),
  { ok: false, status: 400, code: "terms_acceptance_required" },
);

assert.deepEqual(
  validateRegistrationInput({ ...validInput, email: "invalid" }),
  { ok: false, status: 400, code: "invalid_email" },
);

assert.deepEqual(
  validateRegistrationInput({ ...validInput, password: "short" }),
  { ok: false, status: 400, code: "password_too_short" },
);

console.log("REGISTER VALIDATION: PASS");
