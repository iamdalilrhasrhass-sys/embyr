import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/support" : "https://embir.xyz/support";
  const title = locale === "fr" ? "Support et contact — Embir" : "Support & Contact — Embir";
  const description = locale === "fr"
    ? "Contactez le support Embir pour toute question sur votre compte, la vérification, la sécurité, un signalement ou le modèle freemium."
    : "Contact Embir support for questions about your account, verification, safety, reports, or the freemium model.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/support", "en": "https://embir.xyz/support", "x-default": "https://embir.xyz/support" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Support+général&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Support+général&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function SupportPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const contacts = isFr ? [
    { title: "Support général", email: "support@embir.xyz", desc: "Questions sur votre compte, problèmes techniques, feedback." },
    { title: "Sécurité et modération", email: "moderation@embir.xyz", desc: "Signaler un comportement grave, faire appel d'une décision de modération." },
    { title: "Confidentialité", email: "privacy@embir.xyz", desc: "Questions sur vos données personnelles, exercice de vos droits RGPD." },
    { title: "Partenariats", email: "partners@embir.xyz", desc: "Propositions de partenariat, relations presse, collaborations." },
  ] : [
    { title: "General Support", email: "support@embir.xyz", desc: "Account questions, technical issues, feedback." },
    { title: "Safety & Moderation", email: "moderation@embir.xyz", desc: "Report serious behavior, appeal a moderation decision." },
    { title: "Privacy", email: "privacy@embir.xyz", desc: "Questions about your personal data, exercise your GDPR rights." },
    { title: "Partnerships", email: "partners@embir.xyz", desc: "Partnership proposals, press relations, collaborations." },
  ];

  const faq = isFr ? [
    { q: "Comment supprimer mon compte ?", a: "Allez dans les paramètres de votre profil, puis 'Supprimer mon compte'. La suppression est immédiate et irréversible. Vos données sont effacées dans un délai de 30 jours." },
    { q: "Comment signaler un utilisateur ?", a: "Sur le profil de l'utilisateur ou dans votre conversation, cliquez sur le bouton 'Signaler'. Décrivez le problème. Notre équipe de modération examinera votre signalement." },
    { q: "Embir est-il vraiment gratuit ?", a: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire." },
    { q: "Quand l'application mobile sera-t-elle disponible ?", a: "L'application mobile est en développement. Nous nous concentrons d'abord sur la version web et la constitution de la communauté fondatrice. La sortie mobile sera annoncée à tous les membres." },
    { q: "Comment fonctionne la vérification de profil ?", a: "La vérification est facultative. Envoyez un selfie avec le code unique demandé. Si la demande est approuvée, un badge visible apparaît ; il ne prouve ni l'identité complète ni les intentions." },
  ] : [
    { q: "How do I delete my account?", a: "Go to your profile settings, then 'Delete my account'. Deletion is immediate and irreversible. Your data is erased within 30 days." },
    { q: "How do I report a user?", a: "On the user's profile or in your conversation, click the 'Report' button. Describe the issue. Our moderation team will review your report." },
    { q: "Is Embir really free?", a: "Everything needed to meet someone is free. No credit card required." },
    { q: "When will the mobile app be available?", a: "The mobile app is in development. We're focusing first on the web version and building the founding community. The mobile release will be announced to all members." },
    { q: "How does profile verification work?", a: "Verification is optional. Submit a selfie with the requested unique code. If the request is approved, a visible badge appears; it does not prove full identity or intentions." },
  ];

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{isFr ? "Aide" : "Help"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{isFr ? "Support et contact" : "Support & Contact"}</h1>
        <p className="mt-6 text-base leading-relaxed text-white/55">
          {isFr ? "Une question, un problème, une suggestion ? L'équipe Embir est là pour vous aider." : "A question, a problem, a suggestion? The Embir team is here to help."}
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {contacts.map((c) => (
            <div key={c.email} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="font-serif text-xl text-white">{c.title}</h2>
              <p className="mt-2 text-sm text-white/45">{c.desc}</p>
              <a href={`mailto:${c.email}`} className="mt-3 inline-block text-sm font-medium text-[#d4a574] hover:text-[#e8c4a2]">{c.email}</a>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Questions fréquentes" : "Frequently Asked Questions"}</h2>
          <div className="mt-6 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <summary className="cursor-pointer text-sm font-semibold text-white/80">{item.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-white/45">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
          <h2 className="font-serif text-2xl text-white">{isFr ? "⚠️ Urgence ou danger immédiat" : "⚠️ Emergency or immediate danger"}</h2>
          <p className="mt-3 text-sm text-white/55">
            {isFr ? "Embir n'est pas un service d'urgence. Si vous êtes en danger immédiat, contactez les services d'urgence de votre pays (112 en Europe, 911 aux États-Unis, 999 au Royaume-Uni)." : "Embir is not an emergency service. If you are in immediate danger, contact your local emergency services (112 in Europe, 911 in the US, 999 in the UK)."}
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Rejoindre Embir" : "Join Embir"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr ? "Crée ton profil gratuitement et découvre une nouvelle façon de rencontrer." : "Create your profile for free and discover a new way to meet people."}
          </p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">{isFr ? "Créer mon profil gratuit" : "Create my free profile"}</Link>
        </section>
      </article>
    </main>
  );
}
