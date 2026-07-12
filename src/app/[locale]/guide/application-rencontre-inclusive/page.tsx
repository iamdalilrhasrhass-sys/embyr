import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide appli de rencontre inclusive",
  description: "Guide appli de rencontre inclusive",
  alternates: { canonical: "https://embir.xyz/guide/application-rencontre-inclusive" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl"><h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Choisir une application vraiment inclusive</h1><p className="mt-6 text-lg text-white/50">Guide appli de rencontre inclusive</p>
          <div className="mt-8 flex gap-4"><Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link><Link href="/application-rencontre" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Découvrir Embir</Link></div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl"><h2 className="font-serif text-3xl text-white mb-8">Ce qu'il faut savoir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Profils vérifiés</h3><p className="text-sm text-white/45">Chaque membre peut demander une vérification par selfie. Un badge visible identifie les profils vérifiés ; le blocage et le signalement restent disponibles.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">gratuit pour les connexions essentielles</h3><p className="text-sm text-white/45">Messagerie entre connexions réciproques, compatibilité réciproque, profils complets. Sans engagement.</p></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><h2 className="font-serif text-3xl text-white mb-8">FAQ</h2>
        <div className="space-y-4">
          <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]"><summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il vraiment gratuit ?</summary><p className="px-6 pb-4 text-sm text-white/45">Oui. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.</p></details>
          <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]"><summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Comment les profils sont-ils vérifiés ?</summary><p className="px-6 pb-4 text-sm text-white/45">La vérification est facultative : le membre envoie un selfie avec un code unique. Si la demande est approuvée, un badge visible apparaît sur son profil.</p></details>
        </div></div>
      </section>
      <section className="px-4 pb-16 text-center"><Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link></section>
    </main>
  );
}