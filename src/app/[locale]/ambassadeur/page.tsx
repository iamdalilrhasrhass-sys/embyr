"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { localePath, supportedLocale } from "@/components/connection-os/types";
import EmbirLogo from "@/components/brand/EmbirLogo";
import { trackAmbassadorApplication } from "@/lib/analytics";

const copy = {
  fr: {
    eyebrow: "Programme ambassadeur · cohorte pilote",
    title: "Faire grandir une communauté qui se rencontre vraiment.",
    intro: "Les ambassadeurs ne gagnent ni placement dans la découverte, ni score de compatibilité. Ils testent, écoutent leur communauté et influencent les décisions produit avec des retours concrets.",
    benefitsTitle: "Le rôle, sans promesse artificielle",
    benefits: [
      ["Co-construction", "Tester des parcours en amont et documenter ce qui aide ou freine une vraie connexion."],
      ["Ancrage local", "Faire remonter les attentes d’une ville ou d’une communauté, sans spam ni recrutement de masse."],
      ["Échanges directs", "Participer à des points de feedback et recevoir des nouvelles du produit. Aucun délai de réponse garanti."],
      ["Reconnaissance claire", "Un statut de contributeur peut signaler la participation au programme, sans avantage de matching ou de sécurité."],
    ],
    guardrail: "Le programme n’achète pas l’attention et ne modifie jamais le classement, la compatibilité ou les décisions de modération.",
    formTitle: "Proposer ma candidature",
    formIntro: "Quelques informations suffisent pour comprendre ton contexte et ta motivation.",
    name: "Nom ou pseudonyme public",
    email: "Email de contact",
    age: "Âge",
    city: "Ville",
    country: "Pays",
    platform: "Plateforme principale",
    publicUrl: "Lien public",
    followers: "Taille approximative de la communauté",
    motivation: "Pourquoi veux-tu contribuer à Embir ?",
    ageConsent: "Je certifie avoir 18 ans ou plus.",
    contactConsent: "J’accepte d’être contacté·e au sujet de cette candidature.",
    imageConsent: "J’autorise Embir à repartager mon image uniquement après validation explicite du contenu concerné. (facultatif)",
    submit: "Envoyer ma candidature",
    submitting: "Envoi…",
    successTitle: "Candidature reçue",
    successText: "Merci. L’équipe pourra te contacter par email si ton contexte correspond à la prochaine cohorte.",
    back: "Retour à Embir",
    optional: "facultatif",
    errors: {
      required_fields: "Complète le nom, l’email et la motivation.",
      invalid_email: "Saisis une adresse email valide.",
      minimum_age: "Le programme est réservé aux personnes de 18 ans ou plus.",
      required_consents: "Confirme ton âge et l’autorisation de contact.",
      already_applied: "Une candidature existe déjà pour cet email.",
      rate_limited: "Trop de tentatives. Réessaie plus tard.",
      application_failed: "La candidature n’a pas pu être envoyée. Réessaie dans un instant.",
    },
  },
  en: {
    eyebrow: "Ambassador programme · pilot cohort",
    title: "Grow a community that actually meets.",
    intro: "Ambassadors receive no discovery placement or compatibility advantage. They test, listen to their community and influence product decisions through concrete feedback.",
    benefitsTitle: "The role, without artificial promises",
    benefits: [
      ["Co-creation", "Test journeys early and document what helps or blocks a meaningful connection."],
      ["Local insight", "Represent the expectations of a city or community without spam or mass recruitment."],
      ["Direct dialogue", "Join feedback sessions and receive product updates. No response time is guaranteed."],
      ["Clear recognition", "A contributor status may recognise participation, without matching or safety advantages."],
    ],
    guardrail: "The programme never buys attention or changes ranking, compatibility or moderation decisions.",
    formTitle: "Apply to contribute",
    formIntro: "A few details help us understand your context and motivation.",
    name: "Name or public handle",
    email: "Contact email",
    age: "Age",
    city: "City",
    country: "Country",
    platform: "Main platform",
    publicUrl: "Public link",
    followers: "Approximate community size",
    motivation: "Why do you want to contribute to Embir?",
    ageConsent: "I confirm that I am at least 18 years old.",
    contactConsent: "I agree to be contacted about this application.",
    imageConsent: "Embir may reshare my image only after I explicitly approve the specific content. (optional)",
    submit: "Send my application",
    submitting: "Sending…",
    successTitle: "Application received",
    successText: "Thank you. The team may contact you by email if your context fits an upcoming cohort.",
    back: "Back to Embir",
    optional: "optional",
    errors: {
      required_fields: "Complete your name, email and motivation.",
      invalid_email: "Enter a valid email address.",
      minimum_age: "The programme is for people aged 18 or over.",
      required_consents: "Confirm your age and permission to be contacted.",
      already_applied: "An application already exists for this email.",
      rate_limited: "Too many attempts. Try again later.",
      application_failed: "We could not send the application. Try again in a moment.",
    },
  },
  es: {
    eyebrow: "Programa de embajadores · cohorte piloto",
    title: "Haz crecer una comunidad que se encuentra de verdad.",
    intro: "Los embajadores no reciben ventajas de visibilidad ni compatibilidad. Prueban, escuchan a su comunidad e influyen en el producto con comentarios concretos.",
    benefitsTitle: "El papel, sin promesas artificiales",
    benefits: [
      ["Co-creación", "Probar recorridos y documentar qué ayuda o frena una conexión real."],
      ["Perspectiva local", "Representar las expectativas de una ciudad o comunidad sin spam ni reclutamiento masivo."],
      ["Diálogo directo", "Participar en sesiones de feedback y recibir novedades. Sin plazo de respuesta garantizado."],
      ["Reconocimiento claro", "Un estatus de colaborador puede reconocer la participación, sin ventajas de matching o seguridad."],
    ],
    guardrail: "El programa nunca compra atención ni cambia el ranking, la compatibilidad o la moderación.",
    formTitle: "Presentar mi candidatura",
    formIntro: "Unos pocos datos nos ayudan a entender tu contexto y motivación.",
    name: "Nombre o usuario público",
    email: "Email de contacto",
    age: "Edad",
    city: "Ciudad",
    country: "País",
    platform: "Plataforma principal",
    publicUrl: "Enlace público",
    followers: "Tamaño aproximado de la comunidad",
    motivation: "¿Por qué quieres contribuir a Embir?",
    ageConsent: "Confirmo que tengo al menos 18 años.",
    contactConsent: "Acepto que me contacten sobre esta candidatura.",
    imageConsent: "Embir puede compartir mi imagen solo tras aprobar explícitamente el contenido concreto. (opcional)",
    submit: "Enviar candidatura",
    submitting: "Enviando…",
    successTitle: "Candidatura recibida",
    successText: "Gracias. El equipo podrá contactarte por email si tu contexto encaja en una próxima cohorte.",
    back: "Volver a Embir",
    optional: "opcional",
    errors: {
      required_fields: "Completa el nombre, el email y la motivación.",
      invalid_email: "Introduce un email válido.",
      minimum_age: "El programa es para mayores de 18 años.",
      required_consents: "Confirma tu edad y el permiso de contacto.",
      already_applied: "Ya existe una candidatura para este email.",
      rate_limited: "Demasiados intentos. Inténtalo más tarde.",
      application_failed: "No se pudo enviar la candidatura. Inténtalo de nuevo.",
    },
  },
};

const inputClass = "min-h-12 w-full rounded-xl border border-white/12 bg-white/[0.035] px-4 text-base text-white placeholder:text-white/25 focus:border-embir-rose/60 focus:outline-none focus:ring-2 focus:ring-embir-rose/20";

export default function AmbassadeurPage() {
  const params = useParams<{ locale?: string }>();
  const locale = supportedLocale(params.locale ?? "en");
  const text = copy[locale];
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackAmbassadorApplication("started");
  }

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      age: form.get("age"),
      city: form.get("city"),
      country: form.get("country"),
      platform: form.get("platform"),
      publicUrl: form.get("publicUrl"),
      followers: form.get("followers"),
      motivation: form.get("motivation"),
      consentAge: form.get("consentAge") === "on",
      consentContact: form.get("consentContact") === "on",
      consentImage: form.get("consentImage") === "on",
      locale,
    };

    try {
      const response = await fetch("/api/ambassadors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { code?: string };
      if (!response.ok) {
        const code = result.code || "application_failed";
        setError(text.errors[code as keyof typeof text.errors] || text.errors.application_failed);
        trackAmbassadorApplication("error", code);
        return;
      }
      trackAmbassadorApplication("submitted");
      setSubmitted(true);
    } catch {
      setError(text.errors.application_failed);
      trackAmbassadorApplication("error", "network_error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-embir-void text-white">
      <section className="relative border-b border-white/10 px-4 pb-20 pt-28 sm:pt-36">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,139,167,0.18),transparent_68%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl">
          <Link href={localePath(locale, "/")} aria-label="Embir — Accueil" className="mb-12 inline-flex min-h-11 items-center text-white hover:text-embir-blush"><EmbirLogo variant="lockup" tone="mono" size="sm" decorative /></Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose">{text.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] sm:text-7xl">{text.title}</h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">{text.intro}</p>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-2xl font-serif text-3xl sm:text-4xl">{text.benefitsTitle}</h2>
          <div className="mt-10 grid border-l border-t border-white/10 sm:grid-cols-2">
            {text.benefits.map(([title, description], index) => (
              <article key={title} className="min-h-48 border-b border-r border-white/10 p-6 sm:p-8">
                <p className="font-mono text-xs text-embir-rose">0{index + 1}</p>
                <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 border-l-2 border-embir-rose pl-5 text-sm leading-6 text-embir-blush/80">{text.guardrail}</p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div role="status" className="border-y border-embir-rose/30 py-14 text-center">
              <p className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-embir-rose/40 bg-embir-rose/10 text-2xl text-embir-blush" aria-hidden="true">✦</p>
              <h2 className="font-serif text-4xl">{text.successTitle}</h2>
              <p className="mx-auto mt-4 max-w-lg leading-7 text-white/50">{text.successText}</p>
              <Link href={localePath(locale, "/")} className="mt-8 inline-flex min-h-11 items-center rounded-full border border-white/15 px-6 text-sm font-semibold hover:border-white/30">{text.back}</Link>
            </div>
          ) : (
            <form onSubmit={submitApplication} onFocus={markStarted} className="border-y border-white/10 py-10">
              <h2 className="font-serif text-4xl">{text.formTitle}</h2>
              <p className="mb-8 mt-3 text-sm leading-6 text-white/45">{text.formIntro}</p>

              {error && <p role="alert" className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm text-white/60">{text.name}<input name="name" required maxLength={100} autoComplete="name" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60">{text.email}<input name="email" required type="email" maxLength={255} autoComplete="email" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60">{text.age}<input name="age" required type="number" min={18} max={120} inputMode="numeric" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60">{text.city}<input name="city" maxLength={100} autoComplete="address-level2" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60">{text.country}<input name="country" maxLength={100} autoComplete="country-name" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60">{text.platform}<select name="platform" className={`${inputClass} mt-2`} defaultValue=""><option value="" className="bg-embir-void">—</option><option className="bg-embir-void">Instagram</option><option className="bg-embir-void">TikTok</option><option className="bg-embir-void">YouTube</option><option className="bg-embir-void">Reddit</option><option className="bg-embir-void">Community</option><option className="bg-embir-void">Other</option></select></label>
                <label className="text-sm text-white/60 sm:col-span-2">{text.publicUrl} <span className="text-white/30">({text.optional})</span><input name="publicUrl" type="url" maxLength={300} inputMode="url" placeholder="https://" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60 sm:col-span-2">{text.followers} <span className="text-white/30">({text.optional})</span><input name="followers" type="number" min={0} max={1000000000} inputMode="numeric" className={`${inputClass} mt-2`} /></label>
                <label className="text-sm text-white/60 sm:col-span-2">{text.motivation}<textarea name="motivation" required minLength={20} maxLength={2000} rows={6} className={`${inputClass} mt-2 py-3`} /></label>
              </div>

              <fieldset className="mt-7 space-y-2">
                <legend className="sr-only">Consent</legend>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-6 text-white/55"><input name="consentAge" type="checkbox" required className="mt-1 !h-5 !w-5 shrink-0 accent-embir-rose" />{text.ageConsent}</label>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-6 text-white/55"><input name="consentContact" type="checkbox" required className="mt-1 !h-5 !w-5 shrink-0 accent-embir-rose" />{text.contactConsent}</label>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-6 text-white/55"><input name="consentImage" type="checkbox" className="mt-1 !h-5 !w-5 shrink-0 accent-embir-rose" />{text.imageConsent}</label>
              </fieldset>

              <button type="submit" disabled={submitting} className="mt-8 min-h-12 w-full rounded-full bg-embir-rose px-6 font-semibold text-embir-void transition-colors hover:bg-embir-blush disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {submitting ? text.submitting : text.submit}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
