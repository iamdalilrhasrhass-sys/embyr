import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre compatible par orientation — comment ça marche",
  description: "Découvrez comment Embir utilise vos préférences d'orientation pour ne vous montrer que des profils compatibles. Filtrage intelligent et respectueux.",
  alternates: { canonical: "https://embir.xyz/blog/rencontre-compatible-orientation-guide" },
  openGraph: {
    title: "Rencontre compatible par orientation — comment ça marche",
    description: "Découvrez comment Embir utilise vos préférences d'orientation pour ne vous montrer que des profils compatibles. Filtrage intelligent et respectueux.",
    url: "https://embir.xyz/blog/rencontre-compatible-orientation-guide",
    type: "article",
    locale: "fr_FR",
    siteName: "Embir",
    images: [`/api/og?title=Rencontre+compatible+par+orientation+—+comment+ça+marche&variant=market`],
  },
};

export default function Page() {
  return (
    <article className="emb-page min-h-screen">
      <header className="px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-embir-rose/60" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/25">Blog Embir</span>
            <span className="text-white/10">·</span>
            <span className="text-xs text-white/20">Juin 2026</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl">Rencontres compatibles : comment l'orientation détermine vos matchs</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/45">Découvrez comment Embir utilise vos préférences d'orientation pour ne vous montrer que des profils compatibles. Filtrage intelligent et respectueux.</p>
          <p className="mt-4 text-xs text-white/15">Par l'Équipe Embir · 6 min de lecture</p>
        </div>
      </header>
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl prose prose-invert prose-sm text-white/45 leading-relaxed
          [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4
          [&_h3]:text-lg [&_h3]:text-white/80 [&_h3]:mt-8 [&_h3]:mb-3
          [&_p]:mb-4 [&_strong]:text-white/70
          [&_ul]:mb-6 [&_li]:mb-2">
          <h2>1. Introduction</h2>
          <p>
            Le monde des rencontres en ligne évolue rapidement. En 2026, les attentes des utilisateurs
            ont changé : on recherche désormais <strong>des connexions authentiques, dans un cadre
            respectueux, sans les frustrations des applis traditionnelles</strong>.
          </p>
          <p>
            Que vous cherchiez une relation sérieuse, une connexion amicale, ou simplement à élargir
            votre cercle social, comprendre le paysage actuel des applications de rencontre est essentiel
            pour faire les bons choix.
          </p>

          <h2>2. Le contexte actuel</h2>
          <p>
            La plupart des applications de rencontre fonctionnent sur un modèle freemium qui limite
            rapidement les fonctionnalités gratuites. Les abonnements coûtent entre 8€ et 40€ par mois,
            et les publicités envahissent l'expérience utilisateur.
          </p>
          <p>
            <strong>Embir fait un choix différent :</strong> Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.
            Messagerie entre connexions réciproques, matching par intelligence artificielle, profils vérifiés, zéro
            publicité. Les membres fondateurs conservent cet accès prioritaire aux options facultatives.
          </p>

          <h2>3. Ce qui fait la différence</h2>
          <p>
            Trois éléments distinguent une bonne application de rencontre d'une application ordinaire :
          </p>
          <ul>
            <li><strong>La qualité des profils :</strong> sur Embir, chaque membre peut demander une vérification par selfie et les profils approuvés affichent un badge.</li>
            <li><strong>La pertinence du matching :</strong> notre système de compatibilité suggère des profils adaptés à vos préférences.</li>
            <li><strong>La confiance dans l'environnement :</strong> zéro pub, données protégées, signalement et blocage.</li>
          </ul>

          <h2>4. L'importance de la vérification</h2>
          <p>
            Un badge vérifié indique qu’un contrôle selfie a été approuvé ; il ne garantit ni l’identité complète ni les intentions de la personne. Sur Embir,
            chaque nouveau membre passe par une vérification par selfie en temps réel. Notre système
            compare la photo de profil avec un selfie pris sur le moment, éliminant radicalement les
            faux profils et les robots.
          </p>

          <h2>5. Le matching intelligent</h2>
          <p>
            Contrairement aux applications qui se contentent de trier les profils par distance,
            <strong>Embir utilise l'intelligence artificielle pour comprendre vos préférences</strong>
            et vous suggérer des personnes vraiment compatibles. L'algorithme apprend au fil du temps
            ce qui vous correspond, affinant ses recommandations.
          </p>

          <h2>6. FAQ</h2>
          <h3>Embir est-il vraiment gratuit ?</h3>
          <p>
            Oui. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.
            matching, profils. Les membres fondateurs contribuent aux choix produit.
          </p>
          <h3>Comment les profils sont-ils vérifiés ?</h3>
          <p>
            Par selfie en temps réel. Notre système compare la photo de profil avec un selfie pris sur
            le moment pour confirmer l'identité de chaque membre.
          </p>
          <h3>Dans quelles villes Embir est-il disponible ?</h3>
          <p>
            Les inscriptions sont ouvertes partout en France ; la densité réelle varie selon la ville et les critères
            comme Paris, Lyon, Marseille, Toulouse, Bordeaux, Lille, Nantes, Nice et bien d'autres.
          </p>
        </div>
      </section>
      <section className="px-4 py-16 text-center border-t border-white/[0.04]">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-10 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Créer mon profil gratuit</Link>
        <p className="mt-3 text-xs text-white/20">Rejoignez Embir · gratuit pour les connexions essentielles · 18+</p>
      </section>
    </article>
  );
}