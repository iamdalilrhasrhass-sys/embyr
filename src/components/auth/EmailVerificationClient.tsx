"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VerificationState = "loading" | "success" | "invalid" | "missing";

const copy = {
  fr: {
    eyebrow: "Sécurité du compte",
    loading: "Validation de ton adresse…",
    success: "Ton email est confirmé.",
    successBody: "Ton compte vient de franchir une étape essentielle. Tu peux maintenant terminer ton profil et activer ton signal.",
    invalid: "Ce lien n’est plus valide.",
    invalidBody: "Il a peut-être expiré ou a déjà été remplacé. Connecte-toi puis demande un nouveau lien.",
    missing: "Aucun lien de validation détecté.",
    continue: "Continuer mon profil",
    login: "Me connecter",
    resend: "Renvoyer un lien",
    sending: "Envoi…",
    sent: "Un nouveau lien a été préparé. Vérifie ta boîte de réception.",
    resendError: "Connecte-toi pour demander un nouveau lien.",
  },
  en: {
    eyebrow: "Account security",
    loading: "Confirming your address…",
    success: "Your email is confirmed.",
    successBody: "Your account has completed an essential step. You can now finish your profile and activate your signal.",
    invalid: "This link is no longer valid.",
    invalidBody: "It may have expired or been replaced. Sign in and request a new link.",
    missing: "No verification link was detected.",
    continue: "Continue my profile",
    login: "Sign in",
    resend: "Send a new link",
    sending: "Sending…",
    sent: "A new link has been prepared. Check your inbox.",
    resendError: "Sign in to request a new link.",
  },
  es: {
    eyebrow: "Seguridad de la cuenta",
    loading: "Confirmando tu dirección…",
    success: "Tu email está confirmado.",
    successBody: "Tu cuenta ha completado un paso esencial. Ya puedes terminar tu perfil y activar tu señal.",
    invalid: "Este enlace ya no es válido.",
    invalidBody: "Puede haber caducado o sido reemplazado. Inicia sesión y solicita un nuevo enlace.",
    missing: "No se ha detectado ningún enlace de verificación.",
    continue: "Continuar mi perfil",
    login: "Iniciar sesión",
    resend: "Enviar un nuevo enlace",
    sending: "Enviando…",
    sent: "Se ha preparado un nuevo enlace. Revisa tu bandeja de entrada.",
    resendError: "Inicia sesión para solicitar un nuevo enlace.",
  },
} as const;

export default function EmailVerificationClient({ locale }: { locale: string }) {
  const safeLocale = locale === "fr" || locale === "es" ? locale : "en";
  const text = copy[safeLocale];
  const [state, setState] = useState<VerificationState>("loading");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get("token");
    window.history.replaceState(null, "", window.location.pathname);
    if (!token) {
      queueMicrotask(() => setState("missing"));
      return;
    }
    fetch("/api/auth/email/verify", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("invalid_or_expired");
        return response.json();
      })
      .then(() => setState("success"))
      .catch(() => setState("invalid"));
  }, []);

  async function resend() {
    setResending(true);
    setResendMessage("");
    try {
      const response = await fetch("/api/auth/email/resend", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok) throw new Error("resend_failed");
      setResendMessage(text.sent);
    } catch {
      setResendMessage(text.resendError);
    } finally {
      setResending(false);
    }
  }

  const title = state === "loading"
    ? text.loading
    : state === "success"
      ? text.success
      : state === "invalid"
        ? text.invalid
        : text.missing;
  const body = state === "success" ? text.successBody : state === "loading" ? "" : text.invalidBody;

  return (
    <main className="min-h-screen bg-embir-raised px-5 py-20 text-white">
      <section className="mx-auto flex min-h-[70vh] max-w-xl items-center">
        <div className="w-full rounded-3xl border border-white/[0.08] bg-[radial-gradient(circle_at_top,rgba(216,139,167,0.12),transparent_45%),rgba(255,255,255,0.025)] p-7 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-embir-rose">{text.eyebrow}</p>
          <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full border border-embir-rose/25 bg-embir-rose/[0.08] text-2xl" aria-hidden="true">
            {state === "loading" ? "…" : state === "success" ? "✓" : "!"}
          </div>
          <h1 className="mt-7 font-serif text-4xl leading-tight">{title}</h1>
          {body ? <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/50">{body}</p> : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {state === "success" ? (
              <Link href={`/${safeLocale}/onboarding`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-embir-rose to-embir-rose px-6 text-sm font-semibold text-embir-void">
                {text.continue}
              </Link>
            ) : state !== "loading" ? (
              <>
                <Link href={`/${safeLocale}/auth/login`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-6 text-sm text-white/70">
                  {text.login}
                </Link>
                <button type="button" onClick={resend} disabled={resending} className="min-h-12 rounded-full bg-embir-rose px-6 text-sm font-semibold text-embir-void disabled:opacity-50">
                  {resending ? text.sending : text.resend}
                </button>
              </>
            ) : null}
          </div>
          {resendMessage ? <p className="mt-5 text-xs leading-6 text-white/45" role="status">{resendMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}
