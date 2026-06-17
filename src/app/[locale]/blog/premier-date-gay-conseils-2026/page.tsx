import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Premier date gay — 10 conseils pour une rencontre réussie",
  description: "Guide complet pour réussir son premier date gay : lieu, tenue, conversation, sécurité. Conseils pratiques pour une première rencontre sereine et authentique.",
  alternates: { canonical: "https://embir.xyz/blog/premier-date-gay-conseils-2026" },
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
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Premier date gay : 10 conseils pour que tout se passe bien</h1>
          <p className="mt-5 text-lg text-white/45">Guide complet pour réussir son premier date gay : lieu, tenue, conversation, sécurité. Conseils pratiques pour une première rencontre sereine et authentique.</p>
        </div>
      </header>
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl prose prose-invert prose-sm text-white/45 leading-relaxed">
          <h2>1. Choisissez un lieu neutre et rassurant</h2>
          <p>Pour un premier date, privilégiez un café, un bar calme ou un parc public. Évitez les endroits trop isolés ou trop bruyants.</p>
          <h2>2. Prévenez un ami</h2>
          <p>Donnez l'adresse du rendez-vous à un ami de confiance. C'est une précaution simple qui rassure.</p>
          <h2>3. Restez vous-même</h2>
          <p>Inutile de jouer un rôle. L'authenticité est la qualité la plus appréciée lors d'un premier rendez-vous.</p>
          <h2>4. Écoutez autant que vous parlez</h2>
          <p>Un bon date est une conversation, pas un monologue. Posez des questions, intéressez-vous sincèrement.</p>
          <h2>5. FAQ</h2>
          <h3>Quel est le meilleur endroit pour un premier date gay ?</h3>
          <p>Un café dans un quartier LGBTQ+ friendly, un bar à cocktails calme, ou une balade dans un parc public.</p>
          <h3>Combien de temps doit durer un premier date ?</h3>
          <p>1h à 1h30 est idéal. Assez long pour faire connaissance, assez court pour ne pas forcer si le feeling n'est pas là.</p>
        </div>
      </section>
      <section className="px-4 py-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614]">Créer mon profil gratuit</Link>
      </section>
    </article>
  );
}