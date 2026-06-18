import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/modele-freemium" : "https://embir.xyz/freemium";
  const title = locale === "fr"
    ? "Modèle freemium transparent — Gratuit au lancement | Embir"
    : "Transparent Freemium Model — Free at Launch | Embir";
  const description = locale === "fr"
    ? "Embir est gratuit pendant le lancement. Découvrez ce qui reste gratuit, ce qui pourra devenir premium, et pourquoi un futur freemium finance la sécurité, la modération et l'application mobile."
    : "Embir is free during launch. Discover what stays free, what may become premium later, and why a future freemium funds safety, moderation and the mobile app.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/modele-freemium", "en": "https://embir.xyz/freemium", "x-default": "https://embir.xyz/freemium" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
    robots: { index: true, follow: true },
  };
}

export default async function FreemiumPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Modèle économique",
    h1: "Gratuit au lancement, transparent pour la suite",
    intro: "La plupart des applis de rencontre cachent leur modèle économique derrière des promesses vagues et des paywalls soudains. Embir fait l'inverse : voici exactement ce qui est gratuit aujourd'hui, ce qui pourrait devenir payant plus tard, et pourquoi nous aurons besoin de revenus pour garder la plateforme sûre et durable.",
    sections: [
      {
        title: "Pourquoi Embir est gratuit au lancement",
        body: [
          "Une plateforme de rencontre a besoin d'une vraie communauté avant de pouvoir demander aux gens de payer. Nous devons réunir des membres fondateurs pour tester le produit, donner leur avis, signaler les problèmes et aider à établir la culture de la plateforme.",
          "Facturer dès le premier jour ralentirait la croissance de la communauté et exclurait des personnes avant même qu'elles aient pu voir si Embir fonctionne pour elles. Nous préférons prouver notre valeur d'abord.",
          "Les membres fondateurs profitent de l'expérience complète sans frais : création de profil détaillée, découverte des profils compatibles, messagerie illimitée, vérification selfie, outils de sécurité et participation à la construction même du produit."
        ],
      },
      {
        title: "Ce qui est gratuit aujourd'hui — et le restera",
        items: [
          ["Création de profil", "Crée un profil riche avec photos, centres d'intérêt, préférences et intentions relationnelles. Aucune limite sur ce que tu peux partager."],
          ["Messagerie illimitée", "Échange avec toutes les personnes avec qui tu matches. Pas de quota de messages, pas de blocage qui te force à payer pour continuer une conversation."],
          ["Découverte et compatibilité", "Parcours les profils filtrés par tes préférences. Les signaux de compatibilité t'aident à savoir qui vaut la peine d'être contacté."],
          ["Vérification selfie", "Obtiens le badge vérifié sur ton profil. La vérification est une fonction de sécurité de base, pas un luxe premium."],
          ["Préférences d'orientation", "Définis qui tu veux voir et qui peut te voir. Contrôle total de ta visibilité selon ton orientation et ton genre."],
          ["Sécurité et modération", "Signalement, blocage et modération humaine inclus. La sécurité n'est pas une option payante."],
        ],
      },
      {
        title: "Ce qui pourrait devenir premium — et pourquoi",
        body: [
          "Quand le modèle freemium arrivera, les fonctionnalités premium seront des améliorations optionnelles, pas des remplacements des fonctions essentielles. Elles pourraient inclure : voir qui a aimé ton profil avant le match, des filtres de compatibilité avancés, des boosts de profil pour une visibilité temporaire accrue, et des confirmations de lecture.",
          "Aucune de ces fonctions n'est indispensable pour rencontrer des gens. Ce sont des suppléments qui aident à financer la plateforme pour tout le monde. Les fonctions essentielles — profil, découverte, messagerie, compatibilité de base, sécurité — resteront accessibles gratuitement."
        ],
      },
      {
        title: "Ce que le premium finance concrètement",
        items: [
          ["Développement mobile", "Créer des applications natives iOS et Android nécessite des ressources d'ingénierie importantes. La version web fonctionne sur mobile, mais une app native offre une meilleure expérience."],
          ["Modération humaine", "Chaque signalement est examiné par une vraie personne. Ça coûte de l'argent, mais c'est non négociable pour la sécurité de la communauté. La modération automatique seule ne suffit pas."],
          ["Infrastructure", "Serveurs, bases de données, stockage d'images et surveillance de sécurité évoluent avec la base d'utilisateurs. Une communauté qui grandit a besoin d'une infrastructure qui grandit."],
          ["Sécurité et vérification", "La technologie de vérification selfie, les systèmes anti-fraude et le développement des outils de sécurité nécessitent un investissement continu."],
          ["Amélioration continue", "Développement continu des algorithmes de compatibilité, des systèmes de préférences et de l'expérience utilisateur."],
          ["Équipe support", "De vraies personnes qui répondent aux tickets, traitent les problèmes de compte et aident les utilisateurs qui ont besoin d'assistance."],
        ],
      },
      {
        title: "Ce qui ne sera jamais bloqué derrière un paywall",
        body: [
          "Créer un profil, parcourir des personnes compatibles, envoyer et recevoir des messages, définir tes préférences d'orientation et utiliser les outils de sécurité (signalement, blocage) resteront gratuits.",
          "Une appli de rencontre qui te fait payer pour avoir une conversation basique, ce n'est pas un modèle freemium — c'est un paywall. Embir ne fera jamais ça."
        ],
      },
      {
        title: "Notre engagement envers les membres fondateurs",
        items: [
          ["Préavis", "Nous annoncerons tout changement du modèle freemium bien avant qu'il ne prenne effet. Pas de surprises du jour au lendemain."],
          ["Fonctions essentielles gratuites", "Ce qui est gratuit aujourd'hui pour les membres fondateurs le restera. Les fonctions premium seront des ajouts, pas des remplacements."],
          ["Accès prioritaire", "Les membres fondateurs recevront un accès prioritaire et des avantages produit quand le modèle premium sera introduit."],
          ["Aucune monétisation des données", "Nous ne vendrons jamais tes données. Notre modèle repose sur le freemium, pas sur la surveillance."],
          ["Pas de pubs intrusives", "L'expérience de la plateforme ne sera pas perturbée par la publicité. Les fonctionnalités premium, pas l'inventaire publicitaire, financeront l'avenir d'Embir."],
        ],
      },
    ],
    faq: [
      ["Quand exactement le modèle freemium commencera-t-il ?", "Il n'y a pas de date fixe. La phase de lancement continuera jusqu'à ce que la communauté fondatrice soit établie et que l'application mobile soit prête. Tous les membres recevront un préavis."],
      ["Combien coûteront les fonctionnalités premium ?", "Les prix ne sont pas encore fixés. Notre objectif est de rendre le premium abordable et clairement communiqué — pas de structures de prix confuses ni de frais cachés."],
      ["Est-ce que je peux rester sur la version gratuite pour toujours ?", "Oui. La version gratuite inclura toujours les fonctions essentielles : profil, découverte, messagerie, outils de sécurité et compatibilité de base. Le premium est optionnel."],
      ["Pourquoi ne pas rester gratuit pour toujours ?", "Faire fonctionner une plateforme de rencontre à grande échelle coûte de l'argent réel : serveurs, équipes de modération, ingénieurs, infrastructure de sécurité. Un modèle économique durable garantit qu'Embir puisse exister pendant des années, pas des mois."],
      ["Mes données seront-elles vendues pour financer la plateforme ?", "Non. Les revenus d'Embir proviendront des fonctionnalités premium optionnelles, pas de la vente de données utilisateur. Nous nous y engageons depuis le premier jour."],
      ["Les membres fondateurs devront-ils payer ?", "Les fonctions essentielles que tu utilises gratuitement aujourd'hui le resteront. Quand le premium arrivera, ce seront des fonctions supplémentaires optionnelles, pas un verrou sur ce que tu utilises déjà."],
    ],
    cta: { title: "Rejoins pendant que tout est gratuit", text: "Devient membre fondateur. Découvre la plateforme complète sans frais, et aide à façonner son avenir avant que la moindre fonction premium n'existe.", button: "Créer mon profil gratuit" },
    explore: [
      ["/free-dating-app", "Application gratuite"],
      ["/verified-dating-app", "Profils vérifiés"],
      ["/safety", "Sécurité"],
      ["/about", "À propos d'Embir"],
      ["/terms", "Conditions d'utilisation"],
      ["/privacy", "Confidentialité"],
    ],
  } : {
    badge: "Business Model",
    h1: "Free at launch, transparent about the future",
    intro: "Most dating apps hide their business model behind vague promises and sudden paywalls. Embir takes the opposite approach: here's exactly what's free today, what may become premium later, and why we'll eventually need revenue to keep the platform safe and sustainable.",
    sections: [
      {
        title: "Why Embir is free at launch",
        body: [
          "A dating platform needs a real community before it can ask anyone to pay. We need founding members to test the product, give feedback, report issues, and help establish the platform's culture.",
          "Charging from day one would slow down community growth and exclude people before they've even had a chance to see if Embir works for them. We'd rather prove our value first.",
          "Founding members get the full experience at no cost: detailed profile creation, compatible profile discovery, unlimited messaging, selfie verification, safety tools, and participation in shaping the product itself."
        ],
      },
      {
        title: "What's free today — and will stay free",
        items: [
          ["Profile creation", "Build a rich profile with photos, interests, preferences, and relationship intentions. No limits on what you can share about yourself."],
          ["Unlimited messaging", "Message anyone you match with. No caps, no message quotas, no forcing you to upgrade to keep a conversation going."],
          ["Discovery & compatibility", "Browse profiles filtered by your preferences. Compatibility signals help you decide who's worth reaching out to."],
          ["Selfie verification", "Get the verified badge on your profile. Verification is a basic safety feature, not a premium perk."],
          ["Orientation preferences", "Set who you want to see and who can see you. Full control over your visibility based on orientation and gender."],
          ["Safety & moderation", "Reporting, blocking, and human moderation included. Safety isn't a paid feature."],
        ],
      },
      {
        title: "What may become premium — and why",
        body: [
          "When the freemium model arrives, premium features will be optional enhancements, not replacements for core functionality. They could include: seeing who liked your profile before matching, advanced compatibility filters, profile boosts for temporary increased visibility, and read receipts.",
          "None of these are essential to meeting people. They're nice-to-have extras that help fund the platform for everyone. Core functions — profile, discovery, messaging, basic compatibility, safety — will remain accessible for free."
        ],
      },
      {
        title: "What premium funds in practice",
        items: [
          ["Mobile development", "Building native iOS and Android apps requires significant engineering resources. The web version works on mobile browsers, but native apps provide a better experience."],
          ["Human moderation", "Every report is reviewed by a real person. This costs money but is non-negotiable for community safety. Automated moderation alone isn't enough."],
          ["Infrastructure", "Servers, databases, image storage, and security monitoring all scale with the user base. A growing community needs growing infrastructure."],
          ["Safety & verification", "Selfie verification technology, anti-fraud systems, and safety tool development require ongoing investment."],
          ["Continuous improvement", "Ongoing development of compatibility algorithms, preference systems, and user experience improvements."],
          ["Support team", "Real humans answering support tickets, handling account issues, and helping users who need assistance."],
        ],
      },
      {
        title: "What will never be locked behind a paywall",
        body: [
          "Creating a profile, browsing compatible people, sending and receiving messages, setting orientation preferences, and using safety tools (reporting, blocking) will remain free.",
          "A dating app that charges you to have a basic conversation isn't a freemium model — it's a paywall. Embir won't do that."
        ],
      },
      {
        title: "Our commitment to founding members",
        items: [
          ["Advance notice", "We will announce any freemium changes well before they take effect. No overnight surprises."],
          ["Core features stay free", "What's free now for founding members will remain free. Premium features will be additions, not replacements."],
          ["Priority access", "Founding members will receive priority access and product benefits when the premium model is introduced."],
          ["No data monetization", "We will never sell your data. Our revenue model is freemium, not surveillance."],
          ["No intrusive ads", "The platform experience won't be disrupted by advertising. Premium features, not ad inventory, will fund Embir's future."],
        ],
      },
    ],
    faq: [
      ["When exactly will the freemium model start?", "There is no fixed date. The launch phase will continue until the founding community is established and the mobile app is ready. All members will receive advance notice."],
      ["How much will premium features cost?", "Pricing hasn't been set yet. Our goal is to make premium affordable and clearly communicated — no confusing tier structures or hidden fees."],
      ["Can I stay on the free tier forever?", "Yes. The free tier will always include core features: profile, discovery, messaging, safety tools, and basic compatibility matching. Premium is optional."],
      ["Why not just stay free forever?", "Running a dating platform at scale costs real money: servers, moderation teams, engineers, safety infrastructure. A sustainable business model ensures Embir can exist for years, not months."],
      ["Will my data be sold to fund the platform?", "No. Embir's revenue comes from optional premium features, not from selling user data. We've committed to this from day one."],
      ["Will founding members have to pay?", "The core features you use for free today will stay free. When premium arrives, it will add optional extras — not lock what you already use."],
    ],
    cta: { title: "Join while everything is free", text: "Become a founding member. Experience the full platform at no cost, and help shape its future before any premium features exist.", button: "Create my free profile" },
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
