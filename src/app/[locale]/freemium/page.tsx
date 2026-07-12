import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/modele-freemium" : "https://embir.xyz/freemium";
  const title = locale === "fr"
    ? "Accès Embir — rencontrer sans carte bancaire"
    : "Embir access — meet without a credit card";
  const description = locale === "fr"
    ? "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Profil, sélection compatible, réciprocité, messages et sécurité."
    : "Everything needed to meet someone is free. No credit card required: profile, compatible discovery, reciprocity, messaging and safety.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/modele-freemium", "en": "https://embir.xyz/freemium", "x-default": "https://embir.xyz/freemium" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Connexions+essentielles+gratuites+sur+Embir&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Connexions+essentielles+gratuites+sur+Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function FreemiumPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Accès Embir",
    h1: "Rencontrer sans carte bancaire",
    intro: "Le contrat est simple : tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Embir sépare clairement le chemin vers une rencontre des services de confort facultatifs.",
    sections: [
      {
        title: "Le chemin complet vers une rencontre",
        items: [
          ["Profil", "Crée ton profil, précise tes préférences réciproques, tes intentions et tes centres d'intérêt."],
          ["Sélection compatible", "Découvre une sélection courte de personnes compatibles, sans devoir acheter de visibilité."],
          ["Réciprocité", "Réagis avec du contexte et avance quand l'intérêt est mutuel."],
          ["Messages", "Échange avec tes connexions réciproques sans saisir de moyen de paiement."],
          ["Préparation de la rencontre", "Propose un plan, confirme-le et utilise les repères de sécurité intégrés."],
          ["Sécurité", "Bloque ou signale un comportement et garde le contrôle sur ta visibilité."],
        ],
      },
      {
        title: "Des services facultatifs, clairement séparés",
        body: [
          "Embir peut proposer des services supplémentaires de personnalisation, de confort ou d'expérience. Ils sont présentés comme facultatifs et ne sont pas nécessaires pour créer un profil, découvrir une personne compatible, obtenir une connexion réciproque, discuter ou préparer une rencontre.",
          "Aucun achat ne remplace la compatibilité, la réciprocité ou le consentement. Une option payante ne doit pas fabriquer une connexion ni donner un avantage trompeur sur les autres membres.",
        ],
      },
      {
        title: "Ce que finance le modèle économique",
        items: [
          ["Sécurité", "Outils anti-abus, traitement des signalements et amélioration continue des protections."],
          ["Modération", "Des procédures et une équipe capables d'examiner les situations qui demandent du jugement humain."],
          ["Infrastructure", "Serveurs, stockage, surveillance et résilience nécessaires à une communauté mondiale."],
          ["Produit", "Amélioration de l'expérience web et mobile, de l'accessibilité et de la qualité des connexions."],
        ],
      },
      {
        title: "Une règle vérifiable",
        body: [
          "Si une personne ne peut pas aller du profil à une rencontre réciproque sans payer, le produit ne respecte pas ce contrat. Cette règle guide la conception des écrans, des offres et des expérimentations.",
        ],
      },
    ],
    faq: [
      ["Qu'est-ce qui est gratuit ?", "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire : profil, sélection compatible, réciprocité, messages et outils de sécurité."],
      ["Dois-je enregistrer une carte bancaire ?", "Non. Aucun moyen de paiement n'est demandé pour suivre le chemin vers une rencontre."],
      ["Une option facultative peut-elle améliorer ma compatibilité ?", "Non. La compatibilité dépend des préférences et intentions réciproques, pas d'un achat."],
      ["Comment Embir finance-t-il la plateforme ?", "Des services supplémentaires clairement facultatifs peuvent financer la sécurité, la modération, l'infrastructure et l'amélioration du produit."],
      ["Mes données sont-elles vendues pour financer le service ?", "Le modèle présenté repose sur des services facultatifs, pas sur la vente de données personnelles. Les détails applicables figurent dans la politique de confidentialité."],
    ],
    cta: { title: "Commence sans carte bancaire", text: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Crée ton profil et découvre une sélection compatible.", button: "Créer mon profil" },
    explore: [
      ["/free-dating-app", "Application gratuite"],
      ["/verified-dating-app", "Profils vérifiés"],
      ["/safety", "Sécurité"],
      ["/about", "À propos d'Embir"],
      ["/terms", "Conditions d'utilisation"],
      ["/privacy", "Confidentialité"],
    ],
  } : {
    badge: "Embir access",
    h1: "Meet without a credit card",
    intro: "The contract is simple: everything needed to meet someone is free. No credit card required. Embir clearly separates the path to a meeting from optional convenience services.",
    sections: [
      {
        title: "The complete path to a meeting",
        items: [
          ["Profile", "Create a profile and set reciprocal preferences, intentions and interests."],
          ["Compatible discovery", "Explore a short compatible selection without buying visibility."],
          ["Reciprocity", "React with context and move forward when interest is mutual."],
          ["Messaging", "Talk with reciprocal connections without entering payment details."],
          ["Meeting plan", "Suggest a plan, confirm it and use the built-in safety prompts."],
          ["Safety", "Block or report harmful behavior and control your visibility."],
        ],
      },
      {
        title: "Optional services stay separate",
        body: [
          "Embir may offer additional personalization, convenience or experience services. They are clearly optional and are not required to create a profile, discover a compatible person, form a reciprocal connection, message or prepare a meeting.",
          "A purchase cannot replace compatibility, reciprocity or consent. An optional paid service must not fabricate a connection or create a deceptive advantage over other members.",
        ],
      },
      {
        title: "What the business model funds",
        items: [
          ["Safety", "Anti-abuse tools, report handling and continuous improvement of protections."],
          ["Moderation", "Processes and people able to review situations that require human judgment."],
          ["Infrastructure", "Servers, storage, monitoring and resilience for a worldwide community."],
          ["Product", "A better web and mobile experience, accessibility and connection quality."],
        ],
      },
      {
        title: "A testable rule",
        body: [
          "If a person cannot move from profile to reciprocal meeting without paying, the product is not honoring this contract. That rule guides screens, offers and experiments.",
        ],
      },
    ],
    faq: [
      ["What is free?", "Everything needed to meet someone is free. No credit card required: profile, compatible discovery, reciprocity, messaging and safety tools."],
      ["Do I need to save a credit card?", "No. No payment method is required to follow the path to a meeting."],
      ["Can an optional service improve compatibility?", "No. Compatibility comes from reciprocal preferences and intentions, not a purchase."],
      ["How does Embir fund the platform?", "Clearly optional additional services can fund safety, moderation, infrastructure and product improvements."],
      ["Are personal data sold to fund the service?", "The model described here relies on optional services, not the sale of personal data. Applicable details are set out in the privacy policy."],
    ],
    cta: { title: "Start without a credit card", text: "Everything needed to meet someone is free. Create your profile and discover a compatible selection.", button: "Create my profile" },
    explore: [
      ["/free-dating-app", "Free dating app"],
      ["/verified-dating-app", "Verified dating"],
      ["/safety", "Safety tools"],
      ["/about", "About Embir"],
      ["/terms", "Terms of service"],
      ["/privacy", "Privacy policy"],
    ],
  };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{content.badge}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{content.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">{content.intro}</p>

        <section className="mt-12 space-y-8 text-base leading-relaxed text-white/55">
          {content.sections.map((section, i) => (
            <div key={i} className={i === 0 ? "rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7" : ""}>
              <h2 className="font-serif text-3xl text-white">{section.title}</h2>
              {section.body && section.body.map((p, j) => (
                <p key={j} className="mt-4">{p}</p>
              ))}
              {section.items && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {section.items.map(([title, text]) => (
                    <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                      <h3 className="font-semibold text-white/85">{title}</h3>
                      <p className="mt-2 text-sm text-white/45">{text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Questions fréquentes" : "Frequently asked questions"}</h2>
            <div className="mt-6 space-y-3">
              {content.faq.map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{content.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">{content.cta.text}</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">{content.cta.button}</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">{isFr ? "Explorer plus" : "Explore more"}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {content.explore.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
