export type RegistrationInput = {
  email?: unknown;
  password?: unknown;
  isAdult?: unknown;
  acceptTerms?: unknown;
  acceptPrivacy?: unknown;
  consentSensitiveData?: unknown;
  birthDate?: unknown;
};

export type ValidRegistrationInput = {
  email: string;
  password: string;
  isAdult: true;
  acceptTerms: true;
  acceptPrivacy: true;
  consentSensitiveData: boolean;
  birthDate: string | null;
};

export type RegistrationErrorCode =
  | "email_required"
  | "email_invalid"
  | "password_too_short"
  | "adult_confirmation_required"
  | "terms_required"
  | "privacy_required"
  | "birth_date_invalid"
  | "minimum_age_required";

export function validateRegistrationInput(
  input: RegistrationInput
):
  | { ok: true; value: ValidRegistrationInput }
  | { ok: false; status: 400; error: string; code: RegistrationErrorCode } {
  // Email validation
  if (typeof input.email !== "string" || !input.email.trim()) {
    return { ok: false, status: 400, error: "Email requis", code: "email_required" };
  }
  const email = input.email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, status: 400, error: "Email invalide", code: "email_invalid" };
  }

  // Password validation
  if (typeof input.password !== "string" || input.password.length < 8) {
    return {
      ok: false,
      status: 400,
      error: "Mot de passe trop court (8 caractères minimum)",
      code: "password_too_short",
    };
  }

  // Age verification — must be explicitly true
  if (input.isAdult !== true) {
    return {
      ok: false,
      status: 400,
      error: "Vous devez certifier avoir 18 ans ou plus",
      code: "adult_confirmation_required",
    };
  }

  // Terms acceptance — must be explicitly true
  if (input.acceptTerms !== true) {
    return {
      ok: false,
      status: 400,
      error: "Vous devez accepter les CGU",
      code: "terms_required",
    };
  }

  // Privacy acceptance — must be explicitly true
  if (input.acceptPrivacy !== true) {
    return {
      ok: false,
      status: 400,
      error: "Vous devez accepter la politique de confidentialité",
      code: "privacy_required",
    };
  }

  // Sensitive data consent — optional, default false
  const consentSensitiveData =
    input.consentSensitiveData === true;

  // Birth date validation
  let birthDate: string | null = null;
  if (typeof input.birthDate === "string" && input.birthDate.trim()) {
    const parsed = new Date(input.birthDate);
    if (isNaN(parsed.getTime())) {
      return { ok: false, status: 400, error: "Date de naissance invalide", code: "birth_date_invalid" };
    }
    // Check age >= 18
    const today = new Date();
    let age = today.getFullYear() - parsed.getFullYear();
    const monthDiff = today.getMonth() - parsed.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < parsed.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      return {
        ok: false,
        status: 400,
        error: "Vous devez avoir au moins 18 ans",
        code: "minimum_age_required",
      };
    }
    birthDate = input.birthDate;
  }

  return {
    ok: true,
    value: {
      email,
      password: input.password,
      isAdult: true,
      acceptTerms: true,
      acceptPrivacy: true,
      consentSensitiveData,
      birthDate,
    },
  };
}
