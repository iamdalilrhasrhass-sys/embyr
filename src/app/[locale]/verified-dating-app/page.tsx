import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/profils-verifies" : "https://embir.xyz/verified-dating-app";
  const title = locale === "fr"
    ? "Badge selfie facultatif : fonctionnement et limites | Embir"
    : "Optional Selfie Badge: How It Works and Its Limits | Embir";
  const description = locale === "fr"
    ? "La vérification selfie est facultative sur Embir. Une demande approuvée ajoute un badge visible, sans garantir l'identité complète ni l'absence de risque."
    : "Selfie verification is optional on Embir. An approved request adds a visible badge without guaranteeing full identity or the absence of risk.";
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
    h1: "Badge selfie : ce qu'il indique, et ce qu'il ne prouve pas",
    intro: "Embir propose une vérification selfie facultative avec un code unique. Une demande approuvée ajoute un badge visible, sans prouver l'identité complète, l'âge, les intentions ou la sécurité d'une rencontre.",
    sections: [
      {
        title: "Le problème des faux profils sur les applis de rencontre",
        paragraphs: [
          "Les faux profils, les bots et les photos volées peuvent éroder la confiance. Aucun pourcentage universel ne s'applique à toutes les plateformes, donc Embir ne publie pas d'estimation de marché non sourcée.",
          "Embir part d'un constat simple : la confiance doit être la fondation, pas une fonctionnalité secondaire. C'est pour ça que la vérification est intégrée au cœur du produit, pas ajoutée après coup comme un bonus."
        ],
      },
      {
        title: "Comment fonctionne la vérification par selfie",
        paragraphs: [
          "La vérification est facultative : tu envoies un selfie avec le code unique demandé. Si la demande est approuvée, un badge visible apparaît. Ce badge ne prouve ni l'identité complète, ni l'âge, ni les intentions.",
          "Les profils sans badge restent accessibles selon les mêmes critères de compatibilité. Le badge est un signal limité et ne garantit aucun niveau d'interaction.",
          "Le selfie de vérification n'est pas public. Il est stocké dans un espace privé pour le traitement de la demande et n'est accessible qu'aux comptes autorisés."
        ],
      },
      {
        title: "Pourquoi la vérification change tout",
        cards: [
          ["Un signal visible", "Le badge indique seulement qu'une demande avec selfie et code unique a été approuvée."],
          ["Blocage et signalement", "Si un profil paraît suspect, tu peux le bloquer immédiatement et transmettre un signalement pour examen."],
          ["Confiance plus rapide", "Le badge indique seulement qu'un contrôle selfie a été approuvé. Continue à évaluer le profil et la conversation avec prudence."],
          ["Précautions de rencontre", "Un badge ne garantit ni l'identité complète ni la sécurité d'une rencontre. Garde les précautions habituelles, badge ou non."],
        ],
      },
      {
        title: "Les limites honnêtes de la vérification",
        paragraphs: [
          "Soyons transparents. La vérification selfie indique qu'un contrôle selfie a été approuvé. Elle ne garantit PAS les bonnes intentions, l'honnêteté sur l'âge ou la situation amoureuse, ni un comportement sûr.",
          "Un badge vérifié ne veut pas dire « cette personne est sûre » — il veut dire « cette personne a passé un contrôle photo ». Cette distinction est importante, et nous ne la masquons pas derrière un discours marketing rassurant.",
          "C'est pour ça qu'Embir combine la vérification avec d'autres couches de sécurité : signalement et blocage, signalement facile, blocage instantané, et des règles communautaires claires. Aucun outil ne garantit la sécurité à lui seul — c'est la combinaison des outils qui réduit le risque."
        ],
      },
      {
        title: "Au-delà de la vérification : nos couches de confiance",
        cards: [
          ["Signalement", "Chaque profil et conversation dispose d'un bouton de signalement. Le signalement est enregistré pour examen et le blocage est immédiat."],
          ["Blocage", "Bloque n'importe qui instantanément. La personne perd tout accès à ton profil et à vos messages. Pas d'appel, pas de contournement."],
          ["signalement et blocage", "Les outils de signalement enregistrent les alertes et le blocage est immédiat. Aucun système ne garantit l’absence de faux profil ou de harcèlement."],
          ["Préférences et visibilité", "Tes paramètres d'orientation et de préférences contrôlent qui peut voir ton profil. Ça réduit l'attention non désirée avant même qu'elle n'arrive."],
        ],
      },
      {
        title: "Ce que la vérification ne remplace pas",
        paragraphs: [
          "La vérification est un signal limité, pas une solution magique. Elle ne remplace pas le jugement ni les précautions habituelles :",
        ],
        bullets: [
          "Garde les conversations sur Embir jusqu'à ce que tu sois à l'aise pour passer à une autre plateforme",
          "Fais un appel vidéo avant un premier rendez-vous si tu le souhaites ; cela ne remplace pas les précautions habituelles",
          "Choisis un lieu public pour le premier rendez-vous et préviens un ami de l'endroit où tu vas",
          "Fais confiance à ton instinct — si quelque chose te semble anormal, n'hésite pas à partir ou à annuler",
          "Signale tout comportement suspect ; le signalement est enregistré pour examen et tu peux bloquer immédiatement",
        ],
      },
    ],
    faq: [
      ["La vérification est-elle obligatoire ?", "Non, mais nous la recommandons fortement. Les profils vérifiés ont tendance à avoir de meilleures expériences parce que les autres membres leur font confiance plus rapidement."],
      ["Qu'arrive-t-il à mon selfie de vérification ?", "Il n'est pas public. Il est stocké dans un espace privé pour traiter la demande et son accès est limité aux comptes autorisés."],
      ["Peut-on contourner la vérification selfie ?", "Aucun système n'est parfait, mais la vérification par selfie en direct est nettement plus difficile à falsifier que le téléchargement de photos statiques. Nous améliorons continuellement notre détection."],
      ["Que faire si une personne vérifiée me harcèle ?", "Signale-la. La vérification ne protège personne des conséquences d'un mauvais comportement. Les utilisateurs vérifiés qui violent les règles perdent leur compte comme tout le monde."],
      ["Embir vend-il mes données de vérification ?", "Non. Embir ne vend aucune donnée utilisateur. Notre modèle économique est un futur freemium, pas la monétisation des données."],
      ["La vérification remplace-t-elle un background check ?", "Non. La vérification selfie indique qu'un contrôle selfie a été approuvé, pas les antécédents judiciaires ou le statut marital. C'est une couche de confiance, pas un service d'enquête."],
    ],
    cta: { title: "Demande un badge selfie si tu le souhaites", text: "Crée ton profil et demande la vérification facultative si tu le souhaites. Aucun badge ne garantit l'identité complète ni la sécurité.", button: "Créer mon profil vérifié gratuit" },
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
    h1: "Selfie badge: what it shows and what it cannot prove",
    intro: "Embir offers optional selfie verification using a unique code. An approved request adds a visible badge without proving full identity, age, intentions, or the safety of a meeting.",
    sections: [
      {
        title: "The fake profile problem on dating apps",
        paragraphs: [
          "Fake profiles, bots, and stolen photos can undermine trust. No universal percentage applies across platforms, so Embir does not publish an unsupported market estimate.",
          "Fake and inactive profiles can undermine trust. No universal percentage applies across services, so Embir does not publish an unsupported market estimate.",
          "Embir starts from a simple observation: trust should be the foundation, not an afterthought. That's why verification is built into the core of the product, not tacked on as a bonus feature."
        ],
      },
      {
        title: "How selfie verification works",
        paragraphs: [
          "Verification is optional: submit a selfie with the requested unique code. If the request is approved, a visible badge appears. It does not prove full identity, age, or intentions.",
          "Profiles without a badge remain eligible under the same compatibility criteria. The badge is a limited signal and does not guarantee interaction quality.",
          "The verification selfie is not public. It is stored in private storage to process the request, with access limited to authorized accounts."
        ],
      },
      {
        title: "Why verification changes everything",
        cards: [
          ["A visible signal", "The badge only shows that a request using a selfie and unique code was approved."],
          ["Blocking and reporting", "If a profile seems suspicious, you can block it immediately and submit a report for review."],
          ["Faster trust", "The badge only shows that a selfie check was approved. Continue to assess the profile and conversation carefully."],
          ["Meeting precautions", "A badge does not guarantee full identity or the safety of a meeting. Use normal precautions whether a badge is present or not."],
        ],
      },
      {
        title: "Honest limits: what verification doesn't do",
        paragraphs: [
          "Let's be transparent. Selfie verification shows that a selfie check was approved. It does NOT guarantee good intentions, honesty about age or relationship status, or safe behavior.",
          "A verified badge doesn't mean 'this person is safe' — it means 'this person passed a photo check.' This distinction matters, and we don't hide it behind reassuring marketing language.",
          "That's why Embir combines verification with other safety layers: reporting and blocking, easy reporting, instant blocking, and clear community rules. No single tool guarantees safety — the combination of tools reduces risk."
        ],
      },
      {
        title: "Beyond verification: our trust layers",
        cards: [
          ["Reporting", "Every profile and conversation has a report button. Reports are recorded for review and blocking is immediate."],
          ["Blocking", "Block anyone instantly. They lose all access to your profile and messages. No appeals, no workarounds."],
          ["reporting and blocking", "Reporting records alerts and blocking is immediate. No system can guarantee the absence of fake profiles or harassment."],
          ["Preferences & visibility", "Your orientation and preference settings control who can see your profile. This reduces unwanted attention before it happens."],
        ],
      },
      {
        title: "What verification doesn't replace",
        paragraphs: [
          "Verification is a limited signal, not a magic solution. It does not replace judgment or ordinary safety precautions:",
        ],
        bullets: [
          "Keep conversations on Embir until you're comfortable moving to another platform",
          "Consider a video call before meeting; it does not replace normal safety precautions",
          "Choose a public place for the first date and let a friend know where you're going",
          "Trust your instincts — if something feels off, don't hesitate to leave or cancel",
          "Report suspicious behavior; the report is recorded for review and you can block immediately",
        ],
      },
    ],
    faq: [
      ["Is verification optional?", "Yes. Verification is optional. An approved request adds a visible badge without proving full identity or intentions."],
      ["What happens to my verification selfie?", "It is not public. It is stored privately to process the request, with access limited to authorized accounts."],
      ["Can someone fake the selfie verification?", "No system is perfect, but live selfie verification is significantly harder to fake than uploading static photos. We continuously improve our detection."],
      ["What if someone with a verified badge harasses me?", "Report them. Verification doesn't protect anyone from the consequences of bad behavior. Verified users who violate community rules lose their accounts just like anyone else."],
      ["Does Embir sell my verification data?", "No. Embir does not sell any user data. Our business model is transparent optional services, not data monetization."],
      ["Does verification replace a background check?", "No. Selfie verification shows that a selfie check was approved, not criminal history or marital status. It's a layer of trust, not an investigation service."],
    ],
    cta: { title: "Request a selfie badge if you choose", text: "Create your profile and request optional verification if you choose. No badge guarantees full identity or safety.", button: "Create my free verified profile" },
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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose/70">{content.badge}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{content.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">{content.intro}</p>

        <section className="mt-12 space-y-8 text-base leading-relaxed text-white/55">
          {content.sections.map((section, i) => (
            <div key={i} className={i === 0 || i === 3 ? "rounded-2xl border border-embir-rose-deep/10 bg-embir-rose-deep/[0.03] p-7" : ""}>
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
