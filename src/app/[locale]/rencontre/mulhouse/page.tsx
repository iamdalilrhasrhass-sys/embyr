import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre à Mulhouse — application gratuite et moderne",
  description: "Découvrez Embir pour faire des rencontres à Mulhouse. Application de rencontre gratuite pour les connexions essentielles avec profils vérifiés et matching intelligent.",
  alternates: { canonical: "https://embir.xyz/rencontre/mulhouse" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-embir-rose/20 bg-embir-rose/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-embir-rose" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-embir-rose/80">Mulhouse</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Faire des rencontres à Mulhouse<br/><span className="text-embir-rose">n'a jamais été aussi simple.</span></h1>
          <p className="mt-6 text-lg text-white/50">Mulhouse, la cité du Bollwerk, offre un cadre idéal pour les rencontres. Avec Embir, trouvez des profils compatibles près de chez vous.</p>
          <div className="mt-8 flex gap-4">
            <Link prefetch={false} href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Créer mon profil gratuit</Link>
            <Link prefetch={false} href="/rencontre-sans-abonnement" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Comment ça marche</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pourquoi Mulhouse adopte Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Communauté locale</h3><p className="text-sm text-white/45">Embir construit des communautés ville par ville. À Mulhouse, rencontrez des gens près de chez vous.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Profils vérifiés</h3><p className="text-sm text-white/45">La vérification par selfie est disponible à Mulhouse. Un badge visible identifie les profils vérifiés ; aucun système n’élimine tout risque.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Matching intelligent</h3><p className="text-sm text-white/45">La sélection applique vos préférences déclarées dans les deux sens à Mulhouse.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">sans carte bancaire</h3><p className="text-sm text-white/45">Messagerie entre connexions réciproques, compatibilité réciproque, zéro pub. Sans engagement.</p></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl"><h2 className="font-serif text-3xl text-white mb-8">Quartiers de Mulhouse</h2><p className="text-white/45">Embir couvre tous les quartiers : de la place de la Réunion au quartier des Musées, en passant par le Nouveau Bassin.</p></div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl"><h2 className="font-serif text-3xl text-white mb-8">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Embir est-il disponible à Mulhouse ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, Embir est disponible à Mulhouse et dans toutes les villes françaises.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Puis-je rencontrer des personnes d'autres villes ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, élargissez votre rayon pour découvrir des profils dans les villes voisines.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link prefetch={false} href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-10 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Créer mon profil gratuit à Mulhouse</Link>
      </section>
    </main>
  );
}