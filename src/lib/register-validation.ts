export interface RegistrationInput {
  email?: unknown;
  password?: unknown;
  isAdult?: unknown;
  acceptTerms?: unknown;
}

export interface ValidRegistrationInput {
  email: string;
  password: string;
  isAdult: true;
  acceptTerms: true;
}

export type RegistrationValidationResult =
  | { ok: true; value: ValidRegistrationInput }
  | {
      ok: false;
      status: 400;
      code:
        | "email_required"
        | "invalid_email"
        | "password_required"
        | "password_too_short"
        | "adult_confirmation_required"
        | "terms_acceptance_required";
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationInput(
  input: RegistrationInput,
): RegistrationValidationResult {
  if (typeof input.email !== "string" || input.email.trim() === "") {
    return { ok: false, status: 400, code: "email_required" };
  }

  const email = input.email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, status: 400, code: "invalid_email" };
  }

  if (typeof input.password !== "string" || input.password === "") {
    return { ok: false, status: 400, code: "password_required" };
  }

  if (input.password.length < 8) {
    return { ok: false, status: 400, code: "password_too_short" };
  }

  if (input.isAdult !== true) {
    return { ok: false, status: 400, code: "adult_confirmation_required" };
  }

  if (input.acceptTerms !== true) {
    return { ok: false, status: 400, code: "terms_acceptance_required" };
  }

  return {
    ok: true,
    value: {
      email,
      password: input.password,
      isAdult: true,
      acceptTerms: true,
    },
  };
}
