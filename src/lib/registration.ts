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

export function validateRegistrationInput(
  input: RegistrationInput
):
  | { ok: true; value: ValidRegistrationInput }
  | { ok: false; status: 400; error: string } {
  // Email validation
  if (typeof input.email !== "string" || !input.email.trim()) {
    return { ok: false, status: 400, error: "Email requis" };
  }
  const email = input.email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, status: 400, error: "Email invalide" };
  }

  // Password validation
  if (typeof input.password !== "string" || input.password.length < 8) {
    return {
      ok: false,
      status: 400,
      error: "Mot de passe trop court (8 caractères minimum)",
    };
  }

  // Age verification — must be explicitly true
  if (input.isAdult !== true) {
    return {
      ok: false,
      status: 400,
      error: "Vous devez certifier avoir 18 ans ou plus",
    };
  }

  // Terms acceptance — must be explicitly true
  if (input.acceptTerms !== true) {
    return {
      ok: false,
      status: 400,
      error: "Vous devez accepter les CGU",
    };
  }

  // Privacy acceptance — must be explicitly true
  if (input.acceptPrivacy !== true) {
    return {
      ok: false,
      status: 400,
      error: "Vous devez accepter la politique de confidentialité",
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
      return { ok: false, status: 400, error: "Date de naissance invalide" };
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
