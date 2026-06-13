import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coming Out and Dating — Practical Advice | Embir Blog",
  description: "Navigate coming out and gay dating with confidence. Real advice from the community.",
  keywords: [
    "coming out et rencontres",
    "faire son coming out",
    "coming out gay conseils",
    "première fois rencontre gay",
    "coming out et dating",
    "nouveau gay rencontres",
    "découvrir sa sexualité",
    "peur coming out",
    "accepter son homosexualité",
    "débuter rencontres gay",
  ],
  alternates: {
    canonical: "https://embir.xyz/blog/coming-out-rencontres-conseils",
  },
  openGraph: {
    title: "Coming Out and Dating — Practical Advice | Embir Blog",
    description:
      "Faire son coming-out et se lancer dans les rencontres gay en même temps : guide bienveillant pour avancer à ton rythme.",
    url: "https://embir.xyz/blog/coming-out-rencontres-conseils",
    type: "article",
    siteName: "Embir",
    locale: "en_US",
  },
};

export default function ArticlePage() {
  return (
    <main className="emb-page min-h-screen">
      <article className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <Link
            href="/blog"
            className="text-white/40 hover:text-white/70 text-sm mb-8 inline-block transition-colors"
          >
            ← Blog
          </Link>

          <h1 className="text-3xl md:text-4xl font-black mb-6">
            Coming-Out et Rencontres Gay : Avancer à Ton Rythme
          </h1>

          <p className="text-white/50 text-sm mb-8">
            Publié le 23 mai 2026 · 8 min de lecture
          </p>

          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed space-y-6">
            <p>
              Faire son <strong>coming-out</strong> et se lancer dans les <strong>rencontres gay</strong>,
              c'est un peu comme apprendre à nager en plein milieu de l'océan. Tu essaies de comprendre
              qui tu es, tout en cherchant à rencontrer des mecs, tout en gérant le regard des autres. Ce
              n'est pas facile — et c'est normal. Voici nos conseils pour avancer sereinement, sans pression.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              1. Il n'y a pas d'âge, pas de calendrier, pas de manière unique
            </h2>
            <p>
              Certains font leur <strong>coming-out</strong> à 15 ans, d'autres à 45. Certains l'annoncent
              lors d'un repas de famille, d'autres par un message texte, d'autres ne le "déclarent" jamais
              formellement — ils vivent simplement leur vie et les gens comprennent. Toutes ces approches
              sont valides. Le seul timing qui compte, c'est le tien. Ne te compare pas aux autres.
            </p>
            <p>
              Si tu ressens une pression énorme à l'idée de le dire, demande-toi : est-ce que cette
              pression vient de toi ou des attentes extérieures ? La seule personne qui doit être
              confortable avec ton identité, c'est toi. Le reste viendra quand tu seras prêt.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              2. Commencer par une personne de confiance
            </h2>
            <p>
              L'idée de le dire à tout le monde d'un coup, c'est terrifiant — et inutile. Commence par
              UNE personne de confiance. Un·e ami·e proche, un frère, une sœur, un parent que tu sais
              ouvert d'esprit. Choisis quelqu'un qui t'a déjà prouvé qu'il/elle serait là pour toi, quoi
              qu'il arrive. Une première réaction positive te donnera une force incroyable pour la suite.
            </p>
            <p>
              Et si cette première personne réagit mal ? C'est douloureux, mais ce n'est pas une
              condamnation. Son incompréhension ne définit pas ta valeur. Trouve un autre allié, et
              souviens-toi que sa réaction en dit plus sur elle que sur toi.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              3. Les applis de rencontre : un espace safe pour explorer
            </h2>
            <p>
              Pour beaucoup de jeunes gays, les <strong>
                <Link href="/blog/meilleures-apps-rencontre-gay-gratuites-2026" className="text-rose-400 hover:text-rose-300 underline">
                  applis de rencontre gay
                </Link>
              </strong> sont le premier endroit où ils peuvent être eux-mêmes sans crainte. C'est un espace
              précieux. Sur Embir, par exemple, tu peux discuter avec des mecs qui vivent les mêmes choses,
              poser des questions, découvrir ce qui te plaît — le tout sans avoir à justifier ton orientation
              puisque tout le monde est là pour la même chose.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              4. Attention aux relations "initiatiques" trop déséquilibrées
            </h2>
            <p>
              Quand tu commences les <strong>rencontres gay</strong> tout juste après ton coming-out, il
              y a un piège classique : tomber amoureux du premier mec qui te montre de l'attention. C'est
              normal — tu découvres enfin ce que c'est que d'être désiré pour qui tu es vraiment. Mais
              prends du recul. Profite, vis ces moments, mais ne mets pas toutes tes émotions dans la
              première relation venue. Apprends à distinguer l'affection sincère de la simple validation.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              5. Gérer l'homophobie intériorisée
            </h2>
            <p>
              Même après le <strong>coming-out</strong>, beaucoup de mecs continuent à trimballer des
              années de honte et de culpabilité. C'est ce qu'on appelle l'homophobie intériorisée, et
              elle peut saboter tes rencontres : peur de tenir la main de ton date en public, malaise
              à parler de ta vie amoureuse, tendance à fuir des relations qui deviennent trop "réelles".
            </p>
            <p>
              Reconnaître ce mécanisme est la première étape. Ensuite, il faut du temps, et parfois
              de l'aide. Parler à un psy LGBTQ-friendly, rejoindre des groupes de parole, ou simplement
              t'entourer de personnes qui célèbrent ton identité sans réserve — tout ça aide à déconstruire
              ces réflexes.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              6. La première fois : pas de pression
            </h2>
            <p>
              La "première fois" avec un homme peut être source d'une anxiété immense. Respire. Tu n'as
              rien à prouver. Une première expérience sexuelle n'a pas besoin d'être parfaite ou digne
              d'un film. L'important, c'est que tu te sentes en
              <Link href="/blog/securite-rencontres-gay-regles" className="text-rose-400 hover:text-rose-300 underline">
                {" "}sécurité
              </Link>
              , que la communication soit ouverte, et que tu aies envie de le faire — vraiment envie, pas
              juste pour "enfin avoir une expérience". Le consentement enthousiaste, c'est la base.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">
              7. Tu n'es pas seul
            </h2>
            <p>
              Des millions de mecs sont passés par là avant toi. Cette sensation d'être le seul à galérer
              avec son identité et ses <strong>rencontres</strong> — c'est une illusion. La communauté gay
              est vaste, diverse, et pleine de personnes prêtes à tendre la main. Rejoins des communautés
              en ligne, des associations locales, des groupes sportifs LGBTQ+. Tu y trouveras bien plus que
              des dates : des amis, des mentors, une famille choisie.
            </p>
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
            <p className="text-white/70 mb-4">
              Prêt à explorer les rencontres gay en toute bienveillance ?
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white hover:from-rose-400 hover:to-amber-400 transition-all"
            >
              Rejoins Embir gratuitement
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-white/40 text-sm mb-4">À lire aussi :</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog/securite-rencontres-gay-regles"
                className="text-rose-400/70 hover:text-rose-300 text-sm underline"
              >
                Sécurité et rencontres gay : les règles d'or →
              </Link>
              <Link
                href="/blog/creer-profil-gay-qui-attire"
                className="text-rose-400/70 hover:text-rose-300 text-sm underline"
              >
                Créer un profil gay qui attire →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
