import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/application-rencontre-gratuite" : "https://embir.xyz/free-dating-app";
  const title = locale === "fr"
    ? "Application de rencontre gratuite — Sans carte bancaire | Embir"
    : "Free Dating App — No Credit Card Required | Embir";
  const description = locale === "fr"
    ? "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire : profil, sélection compatible, réciprocité, messages et sécurité."
    : "Everything needed to meet someone is free. No credit card required: profile, compatible discovery, reciprocity, messaging and safety.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/application-rencontre-gratuite", "en": "https://embir.xyz/free-dating-app", "x-default": "https://embir.xyz/free-dating-app" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Pourquoi+les+applis+de+rencontre+bloquent+tout+trop+vite&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Pourquoi+les+applis+de+rencontre+bloquent+tout+trop+vite&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function FreeDatingAppPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Sans carte bancaire",
    h1: "Une application gratuite là où cela compte : rencontrer quelqu’un",
    intro: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Le profil, la sélection compatible, la réciprocité, les messages et les outils de sécurité forment un seul parcours accessible.",
    sections: [
      {
        title: "Pas de paywall au milieu d'une connexion",
        paragraphs: [
          "Certaines applications laissent créer un profil puis bloquent la découverte, les likes reçus ou les messages. Embir applique une règle plus simple : un paiement ne doit pas interrompre le chemin vers une rencontre réciproque.",
          "La compatibilité vient des préférences, des intentions et de l'intérêt mutuel. Elle ne s'achète pas.",
        ],
      },
      {
        title: "Ce que comprend le parcours",
        cards: [
          ["Profil", "Présente tes intentions, tes préférences réciproques et ce qui te ressemble."],
          ["Sélection compatible", "Découvre une sélection courte fondée sur les critères des deux personnes."],
          ["Réciprocité et messages", "Réagis avec du contexte, puis échange quand l'intérêt devient mutuel."],
          ["Plan et sécurité", "Prépare une rencontre et utilise les outils de blocage ou de signalement si nécessaire."],
        ],
      },
      {
        title: "Services facultatifs : une frontière claire",
        paragraphs: [
          "Des services supplémentaires de personnalisation, de confort ou d'expérience peuvent être proposés séparément. Ils ne remplacent ni la compatibilité, ni la réciprocité, ni le consentement.",
          "La question de contrôle est concrète : peux-tu aller du profil à une rencontre réciproque sans carte bancaire ? Sur Embir, la réponse doit rester oui.",
        ],
      },
      {
        title: "Le contrat en cinq points",
        bullets: [
          "Créer et compléter son profil",
          "Découvrir une sélection compatible",
          "Former une connexion réciproque",
          "Échanger et proposer un plan de rencontre",
          "Bloquer, signaler et contrôler sa visibilité",
        ],
      },
    ],
    faq: [
      ["Embir demande-t-il une carte bancaire ?", "Non. Aucun moyen de paiement n'est demandé pour suivre le parcours vers une rencontre."],
      ["Puis-je discuter sans abonnement ?", "Oui. La messagerie entre connexions réciproques fait partie du parcours de rencontre gratuit."],
      ["Une option payante peut-elle créer un match ?", "Non. Une connexion dépend de la compatibilité et de la réciprocité, pas d'un achat."],
      ["Comment Embir finance-t-il le service ?", "Des services supplémentaires clairement facultatifs peuvent financer la sécurité, la modération, l'infrastructure et l'amélioration du produit."],
      ["Quel est le contrat public ?", "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire."],
    ],
    cta: { title: "Commence sans carte bancaire", text: "Crée ton profil, précise tes préférences et découvre une sélection compatible.", button: "Créer mon profil" },
    explore: [
      ["/freemium", "Modèle freemium"],
      ["/verified-dating-app", "Profils vérifiés"],
      ["/tinder-alternative", "Alternative à Tinder"],
      ["/grindr-alternative", "Alternative à Grindr"],
      ["/lgbtq-dating-app", "Rencontre LGBTQ+"],
      ["/about", "À propos d'Embir"],
    ],
  } : {
    badge: "No credit card required",
    h1: "A dating app that is free where it matters: meeting someone",
    intro: "Everything needed to meet someone is free. No credit card required. Profile, compatible discovery, reciprocity, messaging and safety tools form one accessible path.",
    sections: [
      {
        title: "No paywall in the middle of a connection",
        paragraphs: [
          "Some apps let you create a profile and then block discovery, incoming likes or messages. Embir applies a simpler rule: payment must not interrupt the path to a reciprocal meeting.",
          "Compatibility comes from preferences, intentions and mutual interest. It cannot be purchased.",
        ],
      },
      {
        title: "What the path includes",
        cards: [
          ["Profile", "Share your intentions, reciprocal preferences and what makes you distinct."],
          ["Compatible discovery", "Explore a short selection based on both people's criteria."],
          ["Reciprocity and messaging", "React with context, then talk when interest becomes mutual."],
          ["Plan and safety", "Prepare a meeting and use blocking or reporting tools when needed."],
        ],
      },
      {
        title: "Optional services: a clear boundary",
        paragraphs: [
          "Additional personalization, convenience or experience services may be offered separately. They do not replace compatibility, reciprocity or consent.",
          "The control question is concrete: can you move from profile to reciprocal meeting without a credit card? On Embir, the answer must remain yes.",
        ],
      },
      {
        title: "The contract in five points",
        bullets: [
          "Create and complete a profile",
          "Discover a compatible selection",
          "Form a reciprocal connection",
          "Message and suggest a meeting plan",
          "Block, report and control visibility",
        ],
      },
    ],
    faq: [
      ["Does Embir require a credit card?", "No. No payment method is required to follow the path to a meeting."],
      ["Can I message without a subscription?", "Yes. Messaging between reciprocal connections is part of the free meeting path."],
      ["Can a paid option create a match?", "No. A connection depends on compatibility and reciprocity, not a purchase."],
      ["How does Embir fund the service?", "Clearly optional additional services can fund safety, moderation, infrastructure and product improvements."],
      ["What is the public contract?", "Everything needed to meet someone is free. No credit card required."],
    ],
    cta: { title: "Start without a credit card", text: "Create your profile, set your preferences and discover a compatible selection.", button: "Create my profile" },
    explore: [
      ["/freemium", "Freemium model"],
      ["/verified-dating-app", "Verified dating"],
      ["/tinder-alternative", "Tinder alternative"],
      ["/grindr-alternative", "Grindr alternative"],
      ["/lgbtq-dating-app", "LGBTQ dating"],
      ["/about", "About Embir"],
    ],
  };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose/70">{content.badge}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{content.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">{content.intro}</p>

        <section className="mt-12 space-y-8 text-base leading-relaxed text-white/55">
          {content.sections.map((section, i) => (
            <div key={i} className={i === 0 ? "rounded-2xl border border-embir-rose/10 bg-embir-rose/[0.02] p-7" : ""}>
              <h2 className="font-serif text-3xl text-white">{section.title}</h2>
              {section.paragraphs && section.paragraphs.map((p, j) => (
                <p key={j} className="mt-4">{p}</p>
              ))}
              {section.cards && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {section.cards.map(([title, text]) => (
                    <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                      <h3 className="font-semibold text-white/85">{title}</h3>
                      <p className="mt-2 text-sm text-white/45">{text}</p>
                    </div>
                  ))}
                </div>
              )}
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  {section.bullets.map((b) => <li key={b.slice(0, 40)}>{b}</li>)}
                </ul>
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

        <section className="mt-16 rounded-3xl border border-embir-rose/15 bg-embir-rose/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{content.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">{content.cta.text}</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">{content.cta.button}</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">{isFr ? "Explorer plus" : "Explore more"}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {content.explore.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-embir-rose/30 hover:text-embir-rose">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
