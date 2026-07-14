"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EmbirLogo from "@/components/brand/EmbirLogo";
import { localePath, supportedLocale, type SupportedLocale } from "@/components/connection-os/types";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Particles3D from "@/components/ui/Particles3D";
import {
  readAnalyticsAttribution,
  trackSignupCompleted,
  trackSignupError,
  trackSignupPageView,
  trackSignupStarted,
} from "@/lib/analytics";

const copy = {
  fr: {
    founderBadge: "Paris · cohorte fondatrice",
    founderTitle: "Rejoindre la cohorte",
    title: "Créer mon univers",
    founderSubtitle: "Crée ton profil pour rejoindre les premiers membres à Paris.",
    subtitle: "Les fonctions essentielles pour découvrir, échanger et organiser une rencontre sont gratuites.",
    adultTag: "18+ uniquement",
    freeTag: "Connexions essentielles gratuites",
    worldTag: "International",
    email: "Email",
    emailPlaceholder: "vous@exemple.com",
    password: "Mot de passe",
    passwordHint: "8 caractères minimum.",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    referral: "Code de parrainage",
    optional: "optionnel",
    referralHint: "Tu as été invité·e ? Entre le code reçu.",
    referralChecking: "Vérification du code de parrainage…",
    referralValid: "Code valide. Ton invitation sera rattachée au compte.",
    referralInvalid: "Code non reconnu. Tu peux quand même créer ton compte.",
    adultConsent: "Embir est réservé aux personnes majeures. Je certifie avoir 18 ans ou plus.",
    termsBefore: "J’accepte les",
    terms: "Conditions générales d’utilisation",
    termsAnd: "et la",
    privacy: "politique de confidentialité",
    submitting: "Création…",
    founderSubmit: "Créer mon profil fondateur",
    submit: "Créer mon compte gratuit",
    existing: "Déjà un compte ?",
    login: "Se connecter",
    parisQuestion: "Tu viens de la campagne Paris ?",
    parisBack: "Retour au manifeste fondateur",
    errors: {
      email_required: "L’email est requis.",
      email_invalid: "Saisis une adresse email valide.",
      password_too_short: "Le mot de passe doit contenir au moins 8 caractères.",
      adult_confirmation_required: "Tu dois certifier avoir 18 ans ou plus.",
      terms_required: "Tu dois accepter les conditions d’utilisation.",
      privacy_required: "Tu dois accepter la politique de confidentialité.",
      birth_date_invalid: "La date de naissance est invalide.",
      minimum_age_required: "Tu dois avoir au moins 18 ans.",
      email_already_registered: "Un compte existe déjà avec cet email.",
      registration_failed: "La création du compte a échoué. Réessaie dans un instant.",
      rate_limited: "Trop de tentatives. Attends quelques minutes avant de réessayer.",
      network_error: "Connexion impossible. Vérifie ton réseau puis réessaie.",
    },
  },
  en: {
    founderBadge: "Paris · founding cohort",
    founderTitle: "Join the founding cohort",
    title: "Create my universe",
    founderSubtitle: "Create your profile to join the first members in Paris.",
    subtitle: "Core features for discovering people, talking and arranging a meeting are free.",
    adultTag: "18+ only",
    freeTag: "Core connections are free",
    worldTag: "Worldwide",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordHint: "At least 8 characters.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    referral: "Referral code",
    optional: "optional",
    referralHint: "Invited by someone? Enter the code they sent you.",
    referralChecking: "Checking referral code…",
    referralValid: "Valid code. Your invitation will be linked to the account.",
    referralInvalid: "Code not recognised. You can still create your account.",
    adultConsent: "Embir is for adults only. I confirm that I am at least 18 years old.",
    termsBefore: "I accept the",
    terms: "Terms of use",
    termsAnd: "and the",
    privacy: "privacy policy",
    submitting: "Creating…",
    founderSubmit: "Create my founding profile",
    submit: "Create my free account",
    existing: "Already have an account?",
    login: "Sign in",
    parisQuestion: "Coming from the Paris campaign?",
    parisBack: "Back to the founding manifesto",
    errors: {
      email_required: "Email is required.",
      email_invalid: "Enter a valid email address.",
      password_too_short: "Your password must contain at least 8 characters.",
      adult_confirmation_required: "You must confirm that you are at least 18.",
      terms_required: "You must accept the terms of use.",
      privacy_required: "You must accept the privacy policy.",
      birth_date_invalid: "The birth date is invalid.",
      minimum_age_required: "You must be at least 18.",
      email_already_registered: "An account already exists for this email.",
      registration_failed: "We could not create your account. Try again in a moment.",
      rate_limited: "Too many attempts. Wait a few minutes before trying again.",
      network_error: "Unable to connect. Check your network and try again.",
    },
  },
  es: {
    founderBadge: "París · cohorte fundadora",
    founderTitle: "Únete a la cohorte",
    title: "Crear mi universo",
    founderSubtitle: "Crea tu perfil para unirte a los primeros miembros en París.",
    subtitle: "Las funciones esenciales para descubrir, conversar y organizar un encuentro son gratuitas.",
    adultTag: "Solo mayores de 18",
    freeTag: "Conexiones esenciales gratuitas",
    worldTag: "Internacional",
    email: "Email",
    emailPlaceholder: "tu@ejemplo.com",
    password: "Contraseña",
    passwordHint: "8 caracteres como mínimo.",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    referral: "Código de invitación",
    optional: "opcional",
    referralHint: "¿Te han invitado? Introduce el código recibido.",
    referralChecking: "Comprobando el código…",
    referralValid: "Código válido. La invitación se vinculará a tu cuenta.",
    referralInvalid: "Código no reconocido. Puedes crear tu cuenta igualmente.",
    adultConsent: "Embir es solo para adultos. Confirmo que tengo 18 años o más.",
    termsBefore: "Acepto los",
    terms: "Términos de uso",
    termsAnd: "y la",
    privacy: "política de privacidad",
    submitting: "Creando…",
    founderSubmit: "Crear mi perfil fundador",
    submit: "Crear mi cuenta gratuita",
    existing: "¿Ya tienes una cuenta?",
    login: "Entrar",
    parisQuestion: "¿Vienes de la campaña de París?",
    parisBack: "Volver al manifiesto fundador",
    errors: {
      email_required: "El email es obligatorio.",
      email_invalid: "Introduce un email válido.",
      password_too_short: "La contraseña debe tener al menos 8 caracteres.",
      adult_confirmation_required: "Debes confirmar que tienes al menos 18 años.",
      terms_required: "Debes aceptar los términos de uso.",
      privacy_required: "Debes aceptar la política de privacidad.",
      birth_date_invalid: "La fecha de nacimiento no es válida.",
      minimum_age_required: "Debes tener al menos 18 años.",
      email_already_registered: "Ya existe una cuenta con este email.",
      registration_failed: "No hemos podido crear la cuenta. Inténtalo de nuevo.",
      rate_limited: "Demasiados intentos. Espera unos minutos antes de volver a intentarlo.",
      network_error: "No se pudo conectar. Revisa tu red e inténtalo de nuevo.",
    },
  },
} satisfies Record<SupportedLocale, {
  errors: Record<string, string>;
  [key: string]: string | Record<string, string>;
}>;

function safeAttribution(value: string | null): string | undefined {
  if (!value) return undefined;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || undefined;
}

export default function Register() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = supportedLocale(params.locale ?? "en");
  const text = copy[locale];
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref") || "";
  const sourceParam = searchParams.get("source") || searchParams.get("utm_source") || "";
  const campaignParam = searchParams.get("utm_campaign") || "";
  const isParisFounder = `${sourceParam} ${campaignParam}`.toLowerCase().includes("paris");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState(refParam);
  const [isAdult, setIsAdult] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [checkingCode, setCheckingCode] = useState(Boolean(refParam.trim()));
  const signupStartedFired = useRef(false);
  const pageViewFired = useRef(false);

  useEffect(() => {
    if (pageViewFired.current) return;
    pageViewFired.current = true;
    trackSignupPageView();
  }, []);

  useEffect(() => {
    if (!refParam.trim()) return;
    fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: refParam.trim() }),
    })
      .then((response) => response.json())
      .then((data) => setCodeValid(data.valid === true))
      .catch(() => setCodeValid(null))
      .finally(() => setCheckingCode(false));
  }, [refParam]);

  function localError(code: string | undefined): string {
    const errors: Record<string, string> = text.errors;
    return (code && errors[code]) || text.errors.registration_failed;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!isAdult) {
      setError(text.errors.adult_confirmation_required);
      trackSignupError("adult_confirmation_required");
      return;
    }
    if (!acceptTerms) {
      setError(text.errors.terms_required);
      trackSignupError("terms_required");
      return;
    }

    setLoading(true);
    try {
      const attribution = readAnalyticsAttribution();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          isAdult,
          acceptTerms,
          acceptPrivacy: acceptTerms,
          referralCode: referralCode.trim() || undefined,
          locale,
          source: attribution.source || safeAttribution(sourceParam),
          medium: attribution.medium || safeAttribution(searchParams.get("utm_medium")),
          campaign: attribution.campaign || safeAttribution(campaignParam),
        }),
      });
      const data = await response.json() as { code?: string };

      if (!response.ok) {
        const code = data.code || "registration_failed";
        trackSignupError(code);
        setError(localError(code));
        return;
      }

      trackSignupCompleted();
      router.push(localePath(locale, "/onboarding"));
    } catch {
      trackSignupError("network_error");
      setError(text.errors.network_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0614] px-4">
      <div className="emb-liquid-mesh" aria-hidden="true" />
      <div className="emb-hero-orb emb-hero-orb-1" aria-hidden="true" />
      <div className="emb-hero-orb emb-hero-orb-2" aria-hidden="true" />
      <div className="emb-hero-orb emb-hero-orb-3" aria-hidden="true" />
      <Particles3D count={45} className="absolute inset-0 z-[1]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" />

      <ScrollReveal direction="up" className="z-10 w-full max-w-md py-8 sm:py-12">
        <section className="emb-glass-extreme relative w-full rounded-[2rem] p-6 shadow-[0_0_80px_rgba(0,0,0,0.6)] sm:p-9" aria-labelledby="register-title">
          <div className="relative z-10 mb-6 flex justify-center">
            <EmbirLogo size="md" />
          </div>

          {isParisFounder && (
            <p className="relative z-10 mb-5 rounded-2xl border border-[#ff5e36]/25 bg-[#ff5e36]/10 px-4 py-3 text-center text-sm font-semibold text-[#ffa333]">
              {text.founderBadge}
            </p>
          )}

          <h1 id="register-title" className="emb-super-title relative z-10 mb-4 text-4xl text-white sm:text-5xl">
            <span className="emb-word">{isParisFounder ? text.founderTitle : text.title}</span>{" "}
            <span className="emb-word emb-gradient-text-super">Embir</span>
          </h1>
          <p className="relative z-10 mb-6 text-sm font-medium leading-relaxed text-white/55">
            {isParisFounder ? text.founderSubtitle : text.subtitle}
          </p>

          <div className="relative z-10 mb-7 grid grid-cols-3 gap-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white/45">
            {[text.adultTag, text.freeTag, text.worldTag].map((tag) => (
              <div key={tag} className="flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-2">
                {tag}
              </div>
            ))}
          </div>

          {error && (
            <div role="alert" className="relative z-10 mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">
              {error}
            </div>
          )}

          {refParam && checkingCode && (
            <div role="status" className="relative z-10 mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-sm text-white/50">
              {text.referralChecking}
            </div>
          )}
          {refParam && codeValid !== null && !checkingCode && (
            <div role="status" className={`relative z-10 mb-6 rounded-xl border p-3 text-center text-sm ${codeValid ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
              {codeValid ? text.referralValid : text.referralInvalid}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            <div className="group">
              <label htmlFor="register-email" className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-white/50 transition-colors group-focus-within:text-[#d4a574]">
                {text.email}
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={() => {
                  if (signupStartedFired.current) return;
                  signupStartedFired.current = true;
                  trackSignupStarted("email_focus");
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white shadow-inner transition-all placeholder:text-white/25 focus:border-[#d4a574]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/20"
                placeholder={text.emailPlaceholder}
              />
            </div>

            <div className="group">
              <label htmlFor="register-password" className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-white/50 transition-colors group-focus-within:text-[#d4a574]">
                {text.password}
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-5 pr-16 text-base text-white shadow-inner transition-all placeholder:text-white/25 focus:border-[#d4a574]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-1 flex min-h-11 min-w-11 items-center justify-center rounded-xl text-xs font-bold text-[#d4a574] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
                  aria-label={showPassword ? text.hidePassword : text.showPassword}
                >
                  {showPassword ? "—" : "◉"}
                </button>
              </div>
              <p className="mt-2 text-xs font-medium text-white/35">{text.passwordHint}</p>
            </div>

            <div className="group">
              <label htmlFor="register-referral" className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-white/50 transition-colors group-focus-within:text-[#d4a574]">
                {text.referral} <span className="font-normal normal-case tracking-normal text-white/30">({text.optional})</span>
              </label>
              <input
                id="register-referral"
                type="text"
                value={referralCode}
                onChange={(event) => {
                  setReferralCode(event.target.value.toUpperCase());
                  setCodeValid(null);
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base uppercase tracking-widest text-white shadow-inner transition-all placeholder:normal-case placeholder:tracking-normal placeholder:text-white/25 focus:border-[#d4a574]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/20"
                placeholder="EMB-XXXXXX"
                maxLength={10}
                spellCheck={false}
              />
              <p className="mt-2 text-xs font-medium text-white/35">{text.referralHint}</p>
            </div>

            <fieldset className="space-y-2 pt-1">
              <legend className="sr-only">Consent</legend>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl px-1 py-2 text-xs leading-relaxed text-white/55 transition-colors hover:text-white/75">
                <input
                  type="checkbox"
                  checked={isAdult}
                  onChange={(event) => setIsAdult(event.target.checked)}
                  className="mt-0.5 !h-5 !w-5 shrink-0 accent-[#d4a574]"
                />
                <span>{text.adultConsent}</span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl px-1 py-2 text-xs leading-relaxed text-white/55 transition-colors hover:text-white/75">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(event) => setAcceptTerms(event.target.checked)}
                  className="mt-0.5 !h-5 !w-5 shrink-0 accent-[#d4a574]"
                />
                <span>
                  {text.termsBefore}{" "}
                  <Link href={localePath(locale, "/legal/cgu")} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#d4a574] hover:text-[#ffa333]">
                    {text.terms}
                  </Link>{" "}
                  {text.termsAnd}{" "}
                  <Link href={localePath(locale, "/legal/confidentialite")} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#d4a574] hover:text-[#ffa333]">
                    {text.privacy}
                  </Link>.
                </span>
              </label>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="emb-cta-mega relative z-10 mt-3 w-full rounded-2xl bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(255,31,90,0.25)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? text.submitting : isParisFounder ? text.founderSubmit : text.submit}
            </button>
          </form>

          <p className="relative z-10 mt-7 text-center text-sm font-medium text-white/40">
            {text.existing}{" "}
            <Link href={localePath(locale, "/auth/login")} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#d4a574] hover:text-[#ffa333]">
              {text.login}
            </Link>
          </p>
          <p className="relative z-10 mt-4 text-center text-xs text-white/30">
            {text.parisQuestion}{" "}
            <Link href={localePath(locale, "/paris")} prefetch={false} className="inline-flex min-h-11 items-center text-[#ffa333]/80 hover:text-[#ffa333]">
              {text.parisBack}
            </Link>
          </p>
        </section>
      </ScrollReveal>
    </main>
  );
}
