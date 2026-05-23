import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre Gay Oslo — App 100% Gratuite | Embyr",
  description: "Rencontre gay à Oslo sur Embyr. App 100% gratuite sans pubs. Crée ton profil et rencontre des mecs près de chez toi à Oslo, Oslo.",
  keywords: ["rencontre gay oslo", "gay oslo", "rencontre mec oslo", "app gay oslo", "dating gay oslo"],
  alternates: { canonical: "https://embir.xyz/rencontre-gay/oslo" },
};

export default function RencontreGayCity() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Rencontre gay à <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">Oslo</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Tu cherches des rencontres entre hommes à Oslo ? Embyr est l&apos;app de rencontre gay 100% gratuite.
            Crée ton profil en 2 minutes et découvre les mecs près de chez toi, Oslo.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-white font-bold">Gratuit</div>
              <div className="text-white/40 text-sm mt-1">100% sans pubs</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">📍</div>
              <div className="text-white font-bold">Local</div>
              <div className="text-white/40 text-sm mt-1">Mecs près de Oslo</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-white font-bold">Discret</div>
              <div className="text-white/40 text-sm mt-1">Mode privé dispo</div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Prêt à rencontrer des mecs à Oslo ?</h2>
            <p className="text-white/50 mb-6">Rejoins les 700 000 habitants de Oslo — quartiers comme Grünerløkka, Majorstuen, Frogner, Gamle Oslo.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/20">
              Créer mon profil gratuitement
            </Link>
          </div>

          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Pourquoi choisir Embyr pour tes rencontres gay à Oslo ?</h2>
            <p>
              Embyr est conçu pour les hommes qui cherchent des rencontres authentiques à Oslo.
              Sans algorithme intrusif, sans pubs agressives, sans abonnement premium caché.
              Juste des mecs, près de chez toi, prêts à discuter.
            </p>
            <h3 className="text-white/80 text-lg font-semibold">Inscription rapide</h3>
            <p>2 minutes suffisent. Email, mot de passe, et c&apos;est parti. Pas de questionnaire interminable.</p>
            <h3 className="text-white/80 text-lg font-semibold">Messagerie illimitée</h3>
            <p>Parle avec qui tu veux, quand tu veux. Sans limite de messages. Sans payer.</p>
            <h3 className="text-white/80 text-lg font-semibold">Quartiers gay-friendly près de Oslo</h3>
            <p>Grünerløkka, Majorstuen, Frogner, Gamle Oslo, les quartiers où la communauté gay est la plus active.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
