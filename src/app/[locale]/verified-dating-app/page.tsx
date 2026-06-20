import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/profils-verifies" : "https://embir.xyz/verified-dating-app";
  const title = locale === "fr"
    ? "Application de rencontre vérifiée — Profils selfie, vraies personnes | Embir"
    : "Verified Dating App — Selfie-Checked Profiles, Real People | Embir";
  const description = locale === "fr"
    ? "Embir vérifie les profils par selfie pour réduire les faux comptes. Moins de catfish, moins de bots, plus de vraies connexions. Gratuit pendant le lancement pour les membres fondateurs."
    : "Embir verifies profiles by selfie to reduce fake accounts. Less catfishing, fewer bots, more real connections. Free during launch for founding members.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/profils-verifies", "en": "https://embir.xyz/verified-dating-app", "x-default": "https://embir.xyz/verified-dating-app" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Le+problème+des+faux+profils+sur+les+applis+de+rencontre&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Le+problème+des+faux+profils+sur+les+applis+de+rencontre&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function VerifiedDatingAppPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Confiance",
    h1: "Rencontre vérifiée : savoir à qui tu parles vraiment",
    intro: "La plus grande frustration avec les applis de rencontre, ce n'est pas le matching. C'est de découvrir que la personne avec qui tu échanges depuis des jours n'existe pas. Embir s'attaque à ce problème de front avec la vérification par selfie — une barrière simple et efficace contre les faux profils.",
    sections: [
      {
        title: "Le problème des faux profils sur les applis de rencontre",
        paragraphs: [
          "Les faux profils ne sont pas une nuisance mineure — ils sont le problème numéro un qui pourrit l'expérience des applis de rencontre. Catfish, bots, arnaqueurs, profils qui utilisent des photos volées : tout ça érode la confiance et rend chaque interaction suspecte. Quand tu ne sais pas si la personne derrière l'écran est réelle, chaque conversation devient une enquête.",
          "Les études montrent qu'entre 10% et 30% des profils sur les applis de rencontre grand public sont faux ou inactifs. Sur certaines plateformes, ce chiffre grimpe encore plus haut. Le résultat : les utilisateurs légitimes passent leur temps à filtrer le bruit au lieu de faire de vraies rencontres. La fatigue s'installe, la confiance s'effrite, et l'appli devient un jeu de détective plutôt qu'un outil de connexion humaine.",
          "Embir part d'un constat simple : la confiance doit être la fondation, pas une fonctionnalité secondaire. C'est pour ça que la vérification est intégrée au cœur du produit, pas ajoutée après coup comme un bonus."
        ],
      },
      {
        title: "Comment fonctionne la vérification par selfie",
        paragraphs: [
          "Quand tu crées ton profil sur Embir, tu peux le vérifier en prenant un selfie en temps réel. Notre système compare ce selfie avec tes photos de profil. S'ils correspondent, tu reçois un badge vérifié sur ton profil. Ce badge indique à tout le monde que tu es une vraie personne — pas un catfish, pas un bot, pas quelqu'un qui utilise des photos volées.",
          "La vérification est optionnelle mais fortement encouragée. Les profils sans badge ne sont pas pénalisés, mais les profils vérifiés obtiennent généralement plus d'interactions authentiques parce que les autres membres savent qu'ils sont réels.",
          "Le selfie de vérification n'est pas stocké publiquement. Il est comparé avec tes photos de profil puis supprimé. Seul le badge vérifié reste visible. Nous ne conservons pas l'image du selfie au-delà de la vérification, sauf obligation légale contraire."
        ],
      },
      {
        title: "Pourquoi la vérification change tout",
        cards: [
          ["Moins de faux profils", "La vérification selfie crée une vraie barrière. Créer un faux compte nécessite de passer un contrôle photo en direct, ce qui est nettement plus difficile que de télécharger des photos volées. Les bots et les usines à faux profils évitent les plateformes qui demandent ce type de vérification."],
          ["Moins de catfishing", "Le catfishing repose sur de fausses photos. La vérification rend beaucoup plus difficile de se faire passer pour quelqu'un d'autre. Les signalements de catfish sont pris au sérieux et les comptes concernés sont supprimés après enquête."],
          ["Confiance plus rapide", "Quand tu vois le badge vérifié, tu peux sauter la phase « est-ce que cette personne est réelle ? » et te concentrer sur ce qui compte vraiment : êtes-vous compatibles ?"],
          ["Premiers rendez-vous plus sûrs", "Rencontrer quelqu'un qui a vérifié son identité réduit un risque majeur. Tu dois toujours prendre des précautions normales, mais au moins tu sais que la personne correspond à ses photos."],
        ],
      },
      {
        title: "Les limites honnêtes de la vérification",
        paragraphs: [
          "Soyons transparents. La vérification selfie confirme qu'une personne est réelle et correspond à ses photos. Elle ne garantit PAS les bonnes intentions, l'honnêteté sur l'âge ou la situation amoureuse, ni un comportement sûr.",
          "Un badge vérifié ne veut pas dire « cette personne est sûre » — il veut dire « cette personne a passé un contrôle photo ». Cette distinction est importante, et nous ne la masquons pas derrière un discours marketing rassurant.",
          "C'est pour ça qu'Embir combine la vérification avec d'autres couches de sécurité : modération humaine, signalement facile, blocage instantané, et des règles communautaires claires. Aucun outil ne garantit la sécurité à lui seul — c'est la combinaison des outils qui réduit le risque."
        ],
      },
      {
        title: "Au-delà de la vérification : nos couches de confiance",
        cards: [
          ["Signalement", "Chaque profil et chaque conversation a un bouton de signalement en un clic. Les signalements vont à des modérateurs humains, pas juste à un algorithme."],
          ["Blocage", "Bloque n'importe qui instantanément. La personne perd tout accès à ton profil et à vos messages. Pas d'appel, pas de contournement."],
          ["Modération humaine", "Notre équipe examine les signalements quotidiennement. Les faux profils sont supprimés. Le harcèlement entraîne la suspension ou le bannissement."],
          ["Préférences et visibilité", "Tes paramètres d'orientation et de préférences contrôlent qui peut voir ton profil. Ça réduit l'attention non désirée avant même qu'elle n'arrive."],
        ],
      },
      {
        title: "Ce que la vérification ne remplace pas",
        paragraphs: [
          "La vérification est un outil puissant, pas une solution magique. Elle réduit le risque de faux profils, mais elle ne remplace pas le bon sens. Voici nos conseils pour des rencontres plus sûres, même avec des profils vérifiés :",
        ],
        bullets: [
          "Garde les conversations sur Embir jusqu'à ce que tu sois à l'aise pour passer à une autre plateforme",
          "Fais un appel vidéo avant un premier rendez-vous en personne — voir quelqu'un en mouvement confirme ce que la vérification a déjà établi",
          "Choisis un lieu public pour le premier rendez-vous et préviens un ami de l'endroit où tu vas",
          "Fais confiance à ton instinct — si quelque chose te semble anormal, n'hésite pas à partir ou à annuler",
          "Signale tout comportement suspect, même si tu n'es pas sûr — l'équipe de modération examinera le contexte",
        ],
      },
    ],
    faq: [
      ["La vérification est-elle obligatoire ?", "Non, mais nous la recommandons fortement. Les profils vérifiés ont tendance à avoir de meilleures expériences parce que les autres membres leur font confiance plus rapidement."],
      ["Qu'arrive-t-il à mon selfie de vérification ?", "Il est comparé avec tes photos de profil puis supprimé. Il n'est pas stocké, affiché ni partagé. La seule chose qui reste, c'est ton badge vérifié."],
      ["Peut-on contourner la vérification selfie ?", "Aucun système n'est parfait, mais la vérification par selfie en direct est nettement plus difficile à falsifier que le téléchargement de photos statiques. Nous améliorons continuellement notre détection."],
      ["Que faire si une personne vérifiée me harcèle ?", "Signale-la. La vérification ne protège personne des conséquences d'un mauvais comportement. Les utilisateurs vérifiés qui violent les règles perdent leur compte comme tout le monde."],
      ["Embir vend-il mes données de vérification ?", "Non. Embir ne vend aucune donnée utilisateur. Notre modèle économique est un futur freemium, pas la monétisation des données."],
      ["La vérification remplace-t-elle un background check ?", "Non. La vérification selfie confirme l'identité visuelle, pas les antécédents judiciaires ou le statut marital. C'est une couche de confiance, pas un service d'enquête."],
    ],
    cta: { title: "Rejoins une communauté vérifiée", text: "Crée ton profil, vérifie-le par selfie, et rencontre de vraies personnes qui ont fait la même chose. Gratuit pendant le lancement.", button: "Créer mon profil vérifié gratuit" },
    explore: [
      ["/safety", "Sécurité"],
      ["/moderation", "Modération"],
      ["/age-verification", "Vérification d'âge"],
      ["/lgbtq-dating-app", "Rencontre LGBTQ+"],
      ["/about", "À propos d'Embir"],
      ["/freemium", "Modèle freemium"],
    ],
  } : {
    badge: "Trust",
    h1: "Verified dating: know who you're talking to",
    intro: "The biggest frustration with dating apps isn't the matching. It's discovering the person you've been talking to for days doesn't exist. Embir tackles this head-on with selfie verification — a simple, effective barrier against fake profiles that makes the entire experience more trustworthy.",
    sections: [
      {
        title: "The fake profile problem on dating apps",
        paragraphs: [
          "Fake profiles aren't a minor nuisance — they're the number one issue that ruins the dating app experience. Catfish, bots, scammers, profiles using stolen photos: all of this erodes trust and makes every interaction suspicious. When you don't know if the person behind the screen is real, every conversation becomes an investigation.",
          "Studies suggest between 10% and 30% of profiles on mainstream dating apps are fake or inactive. On some platforms, the number climbs even higher. The result: legitimate users spend their time filtering noise instead of making real connections. Fatigue sets in, trust erodes, and the app becomes a detective game rather than a tool for human connection.",
          "Embir starts from a simple observation: trust should be the foundation, not an afterthought. That's why verification is built into the core of the product, not tacked on as a bonus feature."
        ],
      },
      {
        title: "How selfie verification works",
        paragraphs: [
          "When you create your profile on Embir, you can verify it by taking a real-time selfie. Our system compares this selfie with your profile photos. If they match, you receive a verified badge on your profile. This badge tells everyone you're a real person — not a catfish, not a bot, not someone using stolen photos.",
          "Verification is optional but strongly encouraged. Profiles without the badge aren't penalized, but verified profiles tend to get more genuine interactions because other members know they're real.",
          "The verification selfie is not stored publicly. It is compared with your profile photos and then discarded. Only the verified badge remains visible. We don't retain the selfie image beyond verification, unless legally required otherwise."
        ],
      },
      {
        title: "Why verification changes everything",
        cards: [
          ["Fewer fake profiles", "Selfie verification creates a real barrier. Creating a fake account requires passing a live photo check, which is significantly harder than uploading stolen photos. Bots and fake profile farms avoid platforms that require this kind of verification."],
          ["Less catfishing", "Catfishing relies on fake photos. Verification makes it much harder to pretend to be someone else. Reported catfish accounts are investigated and removed."],
          ["Faster trust", "When you see the verified badge, you can skip the 'are they real?' phase and focus on what actually matters: are you compatible?"],
          ["Safer first dates", "Meeting someone who has verified their identity reduces one major risk. You still need to practice normal safety precautions, but at least you know the person matches their photos."],
        ],
      },
      {
        title: "Honest limits: what verification doesn't do",
        paragraphs: [
          "Let's be transparent. Selfie verification confirms a person is real and matches their photos. It does NOT guarantee good intentions, honesty about age or relationship status, or safe behavior.",
          "A verified badge doesn't mean 'this person is safe' — it means 'this person passed a photo check.' This distinction matters, and we don't hide it behind reassuring marketing language.",
          "That's why Embir combines verification with other safety layers: human moderation, easy reporting, instant blocking, and clear community rules. No single tool guarantees safety — the combination of tools reduces risk."
        ],
      },
      {
        title: "Beyond verification: our trust layers",
        cards: [
          ["Reporting", "Every profile and conversation has a one-tap report button. Reports go to human moderators, not just an algorithm."],
          ["Blocking", "Block anyone instantly. They lose all access to your profile and messages. No appeals, no workarounds."],
          ["Human moderation", "Our team reviews reports daily. Fake profiles are removed. Harassment gets accounts suspended or banned."],
          ["Preferences & visibility", "Your orientation and preference settings control who can see your profile. This reduces unwanted attention before it happens."],
        ],
      },
      {
        title: "What verification doesn't replace",
        paragraphs: [
          "Verification is a powerful tool, not a magic solution. It reduces the risk of fake profiles, but it doesn't replace common sense. Here's our advice for safer dating, even with verified profiles:",
        ],
        bullets: [
          "Keep conversations on Embir until you're comfortable moving to another platform",
          "Do a video call before meeting in person — seeing someone in motion confirms what verification already established",
          "Choose a public place for the first date and let a friend know where you're going",
          "Trust your instincts — if something feels off, don't hesitate to leave or cancel",
          "Report any suspicious behavior, even if you're not sure — the moderation team will review the context",
        ],
      },
    ],
    faq: [
      ["Is verification mandatory?", "No, but we strongly encourage it. Verified profiles tend to have better experiences because other members trust them more quickly."],
      ["What happens to my verification selfie?", "It is compared with your profile photos and then discarded. It is not stored, displayed, or shared. The only thing that remains is your verified badge."],
      ["Can someone fake the selfie verification?", "No system is perfect, but live selfie verification is significantly harder to fake than uploading static photos. We continuously improve our detection."],
      ["What if someone with a verified badge harasses me?", "Report them. Verification doesn't protect anyone from the consequences of bad behavior. Verified users who violate community rules lose their accounts just like anyone else."],
      ["Does Embir sell my verification data?", "No. Embir does not sell any user data. Our business model is a future freemium, not data monetization."],
      ["Does verification replace a background check?", "No. Selfie verification confirms visual identity, not criminal history or marital status. It's a layer of trust, not an investigation service."],
    ],
    cta: { title: "Join a verified community", text: "Create your profile, verify it by selfie, and meet real people who've done the same. Free during launch.", button: "Create my free verified profile" },
    explore: [
      ["/safety", "Safety tools"],
      ["/moderation", "How we moderate"],
      ["/age-verification", "Age verification"],
      ["/lgbtq-dating-app", "LGBTQ dating"],
      ["/about", "About Embir"],
      ["/freemium", "Freemium model"],
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
            <div key={i} className={i === 0 || i === 3 ? "rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7" : ""}>
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
