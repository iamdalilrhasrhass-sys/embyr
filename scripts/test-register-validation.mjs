import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = await readFile("src/lib/register-validation.ts", "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const validationModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`
);
const { validateRegistrationInput } = validationModule;

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
