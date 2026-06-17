import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay dating Nantes : bars, quartiers et applis",
  description: "Gay dating Nantes : bars, quartiers et applis",
  alternates: { canonical: "https://embir.xyz/blog/gay-dating-nantes-guide" },
  openGraph: {
    title: "Gay dating Nantes : bars, quartiers et applis",
    description: "Gay dating Nantes : bars, quartiers et applis",
    url: "https://embir.xyz/blog/gay-dating-nantes-guide",
    type: "article",
    locale: "fr_FR",
    siteName: "Embir",
  },
};

export default function Page() {
  return (
    <article className="emb-page min-h-screen">
      <header className="px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]/60" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/25">Blog Embir</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Gay dating à Nantes : le guide complet</h1>
          <p className="mt-5 text-lg text-white/45">Gay dating Nantes : bars, quartiers et applis</p>
        </div>
      </header>
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl prose prose-invert prose-sm text-white/45 leading-relaxed">
          <h2>1. Introduction</h2>
          <p>Dans le monde des rencontres en ligne, <strong>la qualité de l'expérience fait toute la différence</strong>. Embir a été conçu pour offrir une alternative moderne, gratuite et respectueuse aux applications traditionnelles.</p>
          <h2>2. Le contexte</h2>
          <p>Les utilisateurs d'applis de rencontre expriment une lassitude croissante face au swipe infini, aux profils non vérifiés et aux abonnements coûteux. <strong>Embir répond à ces frustrations</strong> avec une approche radicalement différente.</p>
          <h2>3. Ce qui fait la différence</h2>
          <ul><li><strong>Profils vérifiés :</strong> chaque membre passe par une vérification selfie.</li><li><strong>Matching IA :</strong> notre algorithme DeepSeek analyse vos préférences.</li><li><strong>100% gratuit au lancement :</strong> messagerie illimitée, zéro pub.</li></ul>
          <h2>4. Nos recommandations</h2>
          <p>Pour une expérience de rencontre réussie, privilégiez toujours les plateformes qui vérifient leurs membres, respectent votre vie privée et ne vous enferment pas dans un abonnement.</p>
          <h2>5. FAQ</h2>
          <h3>Embir est-il vraiment gratuit ?</h3><p>Oui. Pendant la phase de lancement, toutes les fonctionnalités sont gratuites.</p>
          <h3>Comment les profils sont-ils vérifiés ?</h3><p>Par selfie en temps réel. Notre IA compare la photo de profil avec un selfie pris sur le moment.</p>
        </div>
      </section>
      <section className="px-4 py-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614]">Créer mon profil gratuit</Link>
      </section>
    </article>
  );
}