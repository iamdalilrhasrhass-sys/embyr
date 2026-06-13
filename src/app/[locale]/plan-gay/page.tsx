import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plan Gay — Rencontre Discrète et Gratuite | Embir",
  description: "Plan gay discret et gratuit. Mode privé disponible. 100% gratuit.",
  alternates: { canonical: "https://embir.xyz/plan-gay" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">Plan Gay Discret et Gratuit</h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">Plan gay discret et gratuit. Mode privé disponible. 100% gratuit.</p>
          <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Prêt à commencer ?</h2>
            <p className="text-white/50 mb-6">Rejoins Embir maintenant. 100% gratuit, sans pubs, sans piège.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40 hover:scale-[1.02]">Créer mon profil gratuitement</Link>
          </div>
          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Pourquoi Embir ?</h2>
            <p>Contrairement aux autres apps de rencontre gay, Embir est 100% gratuit. Messagerie illimitée, profils complets, découverte de mecs près de chez toi — tout est inclus, sans exception.</p>
            <h3 className="text-white/80 text-lg font-semibold">Vraiment gratuit</h3>
            <p>Pas d&apos;abonnement déguisé, pas de "freemium" qui te bloque après 3 messages. Embir est gratuit pour tous, tout le temps.</p>
            <h3 className="text-white/80 text-lg font-semibold">25 langues</h3>
            <p>Parle avec des mecs du monde entier. La traduction automatique est intégrée à la messagerie.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
