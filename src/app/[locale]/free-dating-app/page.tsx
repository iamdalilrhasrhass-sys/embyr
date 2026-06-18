import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/application-rencontre-gratuite" : "https://embir.xyz/free-dating-app";
  const title = locale === "fr"
    ? "Application de rencontre gratuite — Sans paywall au lancement | Embir"
    : "Free Dating App — No Paywall During Launch | Embir";
  const description = locale === "fr"
    ? "Embir est gratuit au lancement : messagerie illimitée, profils vérifiés, matching par compatibilité, découverte complète — sans frais pour les membres fondateurs. Sans fausse promesse."
    : "Embir is free during launch: unlimited messaging, verified profiles, compatibility matching, and full discovery — all at no cost for founding members. No bait-and-switch.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/application-rencontre-gratuite", "en": "https://embir.xyz/free-dating-app", "x-default": "https://embir.xyz/free-dating-app" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
    robots: { index: true, follow: true },
  };
}

export default async function FreeDatingAppPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Gratuit au lancement",
    h1: "Une appli de rencontre vraiment gratuite au lancement — sans piège",
    intro: "« Application de rencontre gratuite » signifie presque toujours « téléchargement gratuit, utilisation payante ». Embir est différent. Pendant notre phase de lancement, chaque fonction essentielle est gratuite — messagerie, matching, profils vérifiés, découverte par compatibilité. Sans piège, sans période d'essai, sans carte bancaire.",
    sections: [
      {
        title: "Pourquoi les applis de rencontre bloquent tout trop vite",
        paragraphs: [
          "Tu l'as sûrement vécu : tu télécharges une appli, tu crées ton profil, tu commences à swiper, et puis — paywall. Messagerie limitée, likes bloqués, profils floutés. L'appli t'a laissé entrer juste assez pour te donner envie, puis elle te ferme la porte. C'est le modèle standard de l'industrie : frustrer l'utilisateur gratuit pour le pousser vers l'abonnement.",
          "Ce modèle n'est pas un accident. Il est conçu pour maximiser la conversion vers le payant, pas pour offrir une bonne expérience. Le résultat : des millions d'utilisateurs qui passent 5 minutes sur l'appli, se font bloquer, désinstallent, et passent à la suivante. L'industrie de la rencontre est devenue une machine à frustration, pas à connexion.",
          "Embir refuse cette logique. Nous pensons qu'une appli de rencontre doit d'abord prouver sa valeur avant de demander quoi que ce soit. Pas l'inverse."
        ],
      },
      {
        title: "Ce qui est gratuit — vraiment — pendant le lancement",
        cards: [
          ["Création de profil complète", "Crée un profil riche avec photos, centres d'intérêt, préférences et intentions. Aucune limite sur ce que tu peux partager. Pas de champs bloqués derrière un abonnement."],
          ["Messagerie illimitée", "Échange avec toutes tes compatibilités. Pas de quota, pas de limite de messages, pas de « passe à l'abonnement pour continuer la conversation ». La messagerie est un droit fondamental sur une appli de rencontre."],
          ["Découverte par préférences", "Parcours les profils filtrés par orientation, âge, intentions et centres d'intérêt. Les préférences déterminent qui tu vois, pas ton abonnement."],
          ["Signaux de compatibilité", "Vois ce que tu as en commun avant d'engager la conversation. Pas un score opaque, mais des éléments concrets qui t'aident à décider."],
        ],
      },
      {
        title: "La transparence plutôt que le piège",
        paragraphs: [
          "On ne va pas te dire que tout sera gratuit pour toujours. Ce serait mentir. Faire tourner une plateforme de rencontre à grande échelle coûte de l'argent : serveurs, modération humaine, infrastructure de sécurité, développement de l'application mobile.",
          "Mais on va être honnêtes sur ce qui va changer et ce qui ne changera pas. Quand un modèle freemium arrivera, les fonctions essentielles que tu utilises aujourd'hui resteront gratuites. Le premium ajoutera des options, il ne retirera rien de ce que tu as déjà.",
          "Et surtout, les membres fondateurs seront les premiers informés et les derniers impactés. Pas de changement surprise du jour au lendemain. Pas de fonction qu'on t'enlève pour te la revendre."
        ],
      },
      {
        title: "Pourquoi tu ne devrais pas avoir à payer avant d'avoir testé",
        paragraphs: [
          "Imagine un restaurant qui te fait payer l'addition avant que tu aies vu le menu. C'est absurde. Pourtant, c'est exactement ce que font la plupart des applis de rencontre : elles te demandent un abonnement avant que tu saches si la communauté te correspond, si les profils sont réels, si l'expérience vaut le coup.",
          "Embir fait l'inverse. La phase de lancement est une période ouverte où tout le monde peut tester la plateforme sans barrière. L'objectif est simple : construire une communauté fondatrice suffisamment grande et diverse pour que l'expérience soit utile dès le départ. Si le produit fonctionne pour toi, tant mieux. S'il ne te correspond pas, tu n'as rien perdu.",
          "On préfère gagner ta confiance par l'usage que par une période d'essai chronométrée qui te met la pression. La confiance ne se facture pas."
        ],
      },
      {
        title: "Membres fondateurs : ce qui t'attend",
        bullets: [
          "Accès complet et gratuit à toutes les fonctions essentielles pendant le lancement",
          "Priorité d'accès et avantages produit quand le modèle premium sera introduit",
          "Information en avance sur toute évolution du modèle économique",
          "Participation à la construction de la culture et des normes de la plateforme",
          "Aucune pression d'abonnement — le premium sera optionnel et clairement communiqué",
        ],
      },
      {
        title: "Ce que « gratuit au lancement » ne veut PAS dire",
        paragraphs: [
          "Gratuit ne veut pas dire bac à sable. Les profils que tu verras sont réels, la vérification est active, la modération est humaine. Ce n'est pas une version bridée en attendant le payant — c'est le vrai produit, avec toutes ses fonctions, ouvert pendant la phase fondatrice.",
          "Gratuit ne veut pas dire données revendues. Embir ne vend pas tes données et ne les vendra jamais. Notre futur modèle économique repose sur des options premium, pas sur la monétisation de ta vie privée.",
          "Gratuit ne veut pas dire jetable. Les membres fondateurs font partie de l'histoire d'Embir. Vos retours, vos signalements, votre participation façonnent le produit. Quand le premium arrivera, vous serez reconnus, pas poussés dehors."
        ],
      },
    ],
    faq: [
      ["Est-ce qu'Embir est vraiment gratuit ? Sans piège ?", "Oui, pendant la phase de lancement. Les fonctions essentielles — profil, découverte, messagerie, matching — sont gratuites pour les membres fondateurs. Pas de frais cachés, pas de carte bancaire demandée."],
      ["Quand Embir commencera-t-il à faire payer ?", "Un modèle freemium sera introduit après la phase de lancement, une fois la communauté fondatrice établie. Tous les membres seront informés bien à l'avance de tout changement."],
      ["Que deviennent les membres fondateurs quand le freemium arrive ?", "Les membres fondateurs conservent l'accès aux fonctions essentielles qu'ils utilisent déjà. Les fonctions premium seront des ajouts optionnels, pas des remplacements."],
      ["Pourquoi Embir fait ça différemment ?", "Parce que la confiance se construit en apportant de la valeur d'abord. Une appli qui te demande de payer avant d'avoir fait ses preuves te demande une confiance aveugle. On préfère mériter la tienne."],
      ["Est-ce que mes données sont utilisées pour financer la gratuité ?", "Non. Embir ne vend pas tes données. La gratuité au lancement est un choix stratégique pour construire la communauté. Le futur modèle repose sur des options premium, pas sur la revente de données."],
      ["L'expérience gratuite est-elle limitée par rapport au futur payant ?", "Non. Pendant le lancement, tu as accès à toutes les fonctions du produit. Le futur premium ajoutera des suppléments optionnels — il ne retirera rien de ce que tu utilises aujourd'hui."],
    ],
    cta: { title: "Rejoins gratuitement, reste pour la communauté", text: "Crée ton profil gratuit. Pas de carte bancaire. Pas de période d'essai. Juste une plateforme de rencontre qui veut gagner ta confiance avant de demander quoi que ce soit.", button: "Créer mon profil gratuit" },
    explore: [
      ["/freemium", "Modèle freemium"],
      ["/verified-dating-app", "Profils vérifiés"],
      ["/tinder-alternative", "Alternative à Tinder"],
      ["/grindr-alternative", "Alternative à Grindr"],
      ["/lgbtq-dating-app", "Rencontre LGBTQ+"],
      ["/about", "À propos d'Embir"],
    ],
  } : {
    badge: "Free at launch",
    h1: "A dating app that's actually free during launch — no catch",
    intro: "'Free dating app' usually means 'free to download, pay to use.' Embir is different. During our launch phase, every core feature is free — messaging, matching, verified profiles, compatibility discovery. No bait-and-switch, no trial period, no credit card required.",
    sections: [
      {
        title: "Why dating apps lock you out too fast",
        paragraphs: [
          "You know the pattern: you download an app, create your profile, start swiping, and then — paywall. Limited messaging, locked likes, blurred profiles. The app let you in just enough to get hooked, then slammed the door. This is the industry's standard model: frustrate the free user to push them toward a subscription.",
          "This model isn't an accident. It's designed to maximize paid conversion, not to provide a good experience. The result: millions of users who spend 5 minutes on the app, hit a wall, uninstall, and move to the next one. The dating industry has become a frustration machine, not a connection engine.",
          "Embir rejects this logic. We believe a dating app should prove its value before asking for anything. Not the other way around."
        ],
      },
      {
        title: "What's free — really — during launch",
        cards: [
          ["Full profile creation", "Build a rich profile with photos, interests, preferences, and intentions. No limits on what you can share. No fields locked behind a subscription."],
          ["Unlimited messaging", "Talk to everyone you're compatible with. No quotas, no message caps, no 'upgrade to continue the conversation.' Messaging is a basic right on a dating app."],
          ["Preference-based discovery", "Browse profiles filtered by orientation, age, intentions, and interests. Your preferences determine who you see, not your subscription level."],
          ["Compatibility signals", "See what you have in common before starting a conversation. Not an opaque score, but concrete elements that help you decide."],
        ],
      },
      {
        title: "Transparency instead of bait-and-switch",
        paragraphs: [
          "We're not going to tell you everything will be free forever. That would be dishonest. Running a dating platform at scale costs real money: servers, human moderation, safety infrastructure, mobile app development.",
          "But we'll be honest about what will change and what won't. When a freemium model arrives, the core features you use today will remain free. Premium will add options — it won't take away what you already have.",
          "And above all, founding members will be the first to know and the last to be affected. No overnight surprises. No features being taken away and sold back to you."
        ],
      },
      {
        title: "Why you shouldn't have to pay before testing the product",
        paragraphs: [
          "Imagine a restaurant that charges you before you've seen the menu. Absurd, right? Yet that's exactly what most dating apps do: they ask for a subscription before you know if the community fits you, if the profiles are real, if the experience is worthwhile.",
          "Embir does the opposite. The launch phase is an open period where everyone can test the platform without barriers. The goal is simple: build a founding community large enough and diverse enough for the experience to be useful from day one. If the product works for you, great. If it doesn't fit, you've lost nothing.",
          "We'd rather earn your trust through use than through a countdown trial that pressures you. Trust isn't something you charge for."
        ],
      },
      {
        title: "Founding members: what's in it for you",
        bullets: [
          "Full, free access to all core features during the launch phase",
          "Priority access and product benefits when the premium model is introduced",
          "Advance notice of any changes to the business model",
          "A voice in shaping the platform's culture and norms",
          "No subscription pressure — premium will be optional and clearly communicated",
        ],
      },
      {
        title: "What 'free at launch' does NOT mean",
        paragraphs: [
          "Free doesn't mean sandbox. The profiles you see are real, verification is active, moderation is human. This isn't a stripped-down version waiting for paid features — it's the real product, fully functional, open during the founding phase.",
          "Free doesn't mean your data is being sold. Embir doesn't sell your data and never will. Our future business model relies on optional premium features, not on monetizing your private life.",
          "Free doesn't mean disposable. Founding members are part of Embir's story. Your feedback, your reports, your participation shape the product. When premium arrives, you'll be recognized — not pushed out."
        ],
      },
    ],
    faq: [
      ["Is Embir really free? No catch?", "Yes, during the launch phase. Core features — profile, discovery, messaging, matching — are free for founding members. No hidden fees, no credit card required."],
      ["When will Embir start charging?", "A freemium model will be introduced after the launch phase, once the founding community is established. All members will be informed well in advance of any changes."],
      ["What happens to founding members when freemium arrives?", "Founding members retain access to the core features they already use. Premium features will be optional add-ons, not replacements for what was previously free."],
      ["Why is Embir doing this differently?", "Because trust is built by delivering value first. A dating app that asks for payment before proving itself is asking for blind faith. We'd rather earn yours."],
      ["Is my data being monetized to keep things free?", "No. Embir doesn't sell your data. Free access during launch is a strategic choice to build the community. The future model relies on optional premium features, not data resale."],
      ["Is the free experience limited compared to future paid tiers?", "No. During launch, you have access to all product features. Future premium will add optional extras — it won't take away what you use today."],
    ],
    cta: { title: "Join for free, stay for the community", text: "Create your free profile. No credit card. No trial period. Just a dating platform that wants to earn your trust before asking for anything.", button: "Create my free profile" },
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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{content.badge}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{content.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">{content.intro}</p>

        <section className="mt-12 space-y-8 text-base leading-relaxed text-white/55">
          {content.sections.map((section, i) => (
            <div key={i} className={i === 0 ? "rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7" : ""}>
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
