import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grindr vs Alternatives 2026 — Le Vrai Comparatif Gratuit | Embyr",
  description: "Grindr ou une alternative ? Découvre le comparatif complet et gratuit des meilleures apps de rencontre gay en 2026. Embyr, Tinder, Scruff, Romeo — on a tout testé pour toi.",
  keywords: ["grindr alternative", "grindr vs", "meilleure app gay", "alternative grindr gratuite", "app rencontre gay 2026"],
  alternates: { canonical: "https://embir.xyz/grindr-vs-alternatives" },
};

const comparison = [
  {
    feature: "Gratuité",
    embyr: "✅ 100% gratuit",
    grindr: "❌ Freemium (limité sans XTRA)",
    romeo: "✅ Gratuit",
    scruff: "❌ Freemium",
  },
  {
    feature: "Pubs",
    embyr: "✅ Zéro pub",
    grindr: "❌ Pubs intrusives",
    romeo: "⚠️ Quelques pubs",
    scruff: "❌ Pubs fréquentes",
  },
  {
    feature: "Messages illimités",
    embyr: "✅ Oui",
    grindr: "❌ Limités gratuit",
    romeo: "✅ Oui",
    scruff: "✅ Oui",
  },
  {
    feature: "Multilingue",
    embyr: "✅ 25 langues",
    grindr: "✅ 10+ langues",
    romeo: "⚠️ 5 langues",
    scruff: "⚠️ 10 langues",
  },
  {
    feature: "Traduction auto",
    embyr: "✅ Oui (IA)",
    grindr: "❌ Non",
    romeo: "❌ Non",
    scruff: "❌ Non",
  },
  {
    feature: "Mode privé",
    embyr: "✅ Gratuit",
    grindr: "❌ Payant (Unlimited)",
    romeo: "✅ Gratuit",
    scruff: "❌ Payant (Pro)",
  },
  {
    feature: "Profil vérifié",
    embyr: "✅ Photo + badge",
    grindr: "⚠️ Basique",
    romeo: "⚠️ Basique",
    scruff: "⚠️ Basique",
  },
  {
    feature: "Parrainage",
    embyr: "✅ Gagne des perks",
    grindr: "❌ Non",
    romeo: "❌ Non",
    scruff: "❌ Non",
  },
  {
    feature: "Design",
    embyr: "✨ Premium sombre",
    grindr: "🟡 Jaune agressif",
    romeo: "🔵 Bleu classique",
    scruff: "🟠 Orange daté",
  },
  {
    feature: "Communauté",
    embyr: "🌱 Nouvelle, bienveillante",
    grindr: "👥 Massive, tout type",
    romeo: "👥 Établie, Europe",
    scruff: "👥 Ours/cuir, niche",
  },
];

export default function GrindrVsPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Grindr vs{" "}
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
                Alternatives
              </span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Tu en as marre des pubs, des limites de messages et des abonnements hors de prix ? 
              On a comparé les meilleures apps de rencontre gay en 2026. Spoiler : y&apos;a mieux que Grindr.
            </p>
          </div>

          {/* Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.04] p-6 text-center">
              <div className="text-3xl mb-1">🥇</div>
              <div className="text-emerald-400 font-bold text-lg">Embyr</div>
              <div className="text-white/40 text-xs mt-1">Le nouveau champion</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-1">🟡</div>
              <div className="text-white/50 font-bold text-lg">Grindr</div>
              <div className="text-white/30 text-xs mt-1">Le vétéran fatigué</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-1">🔵</div>
              <div className="text-white/50 font-bold text-lg">Romeo</div>
              <div className="text-white/30 text-xs mt-1">Le classique EU</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-1">🟠</div>
              <div className="text-white/50 font-bold text-lg">Scruff</div>
              <div className="text-white/30 text-xs mt-1">Le niche</div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden mb-10">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] bg-white/[0.03] border-b border-white/5 text-xs sm:text-sm font-semibold text-white/80">
              <div className="p-4">Fonctionnalité</div>
              <div className="p-4 text-emerald-400">Embyr</div>
              <div className="p-4">Grindr</div>
              <div className="p-4">Romeo</div>
              <div className="p-4">Scruff</div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] border-b border-white/[0.03] text-xs sm:text-sm text-white/50 ${
                  i % 2 === 0 ? "bg-white/[0.01]" : ""
                }`}
              >
                <div className="p-4 text-white/70 font-medium">{row.feature}</div>
                <div className={`p-4 ${row.embyr.startsWith("✅") ? "text-emerald-400" : "text-white/50"}`}>
                  {row.embyr}
                </div>
                <div className={`p-4 ${row.grindr.startsWith("✅") ? "text-emerald-400" : row.grindr.startsWith("❌") ? "text-rose-400" : "text-white/50"}`}>
                  {row.grindr}
                </div>
                <div className={`p-4 ${row.romeo.startsWith("✅") ? "text-emerald-400" : row.romeo.startsWith("❌") ? "text-rose-400" : "text-white/50"}`}>
                  {row.romeo}
                </div>
                <div className={`p-4 ${row.scruff.startsWith("✅") ? "text-emerald-400" : row.scruff.startsWith("❌") ? "text-rose-400" : "text-white/50"}`}>
                  {row.scruff}
                </div>
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-purple-500/[0.04] p-8 sm:p-10 mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">🏆 Le verdict</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Grindr reste le plus connu, mais son modèle freemium est devenu insupportable : pubs toutes les 30 secondes, 
              messages limités, fonctionnalités de base derrière un paywall à 25€/mois. Les alternatives comme Embyr 
              prouvent qu&apos;on peut avoir une expérience premium <strong className="text-white">sans payer un centime</strong>.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.02] hover:shadow-rose-500/40"
            >
              Essayer Embyr gratuitement 🚀
            </Link>
          </div>

          {/* FAQ */}
          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Questions fréquentes</h2>
            
            <h3 className="text-white/80">Pourquoi quitter Grindr ?</h3>
            <p>Pubs invasives, fonctionnalités essentielles payantes, bots et faux profils, données personnelles monétisées. L&apos;expérience gratuite s&apos;est dégradée année après année pour pousser les utilisateurs vers l&apos;abonnement XTRA à 24,99€/mois.</p>

            <h3 className="text-white/80">Embyr est-il vraiment gratuit ?</h3>
            <p>Oui, 100%. Pas de \"freemium\" caché. Pas de pubs. Pas de limite de messages. Pas d&apos;abonnement. On veut construire la meilleure communauté gay, pas ton portefeuille.</p>

            <h3 className="text-white/80">Quelle est la meilleure alternative à Grindr ?</h3>
            <p>Ça dépend de ce que tu cherches. Pour du sérieux et respectueux : Embyr. Pour du rapide : Grindr reste le plus peuplé. Pour la communauté bear/leather : Scruff. Pour l&apos;Europe : Romeo.</p>

            <h3 className="text-white/80">Mes données sont-elles en sécurité sur Embyr ?</h3>
            <p>Absolument. Pas de revente de données. Pas de traqueurs publicitaires. Pas de shadowban. Juste une app qui respecte ta vie privée.</p>
          </div>

          {/* Share section */}
          <div className="text-center mt-12 pt-8 border-t border-white/5">
            <p className="text-white/40 text-sm mb-4">Partage ce comparatif avec tes potes 👇</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("J'ai comparé Grindr et ses alternatives. Le résultat est surprenant 👀\n\nhttps://embir.xyz/grindr-vs-alternatives")}`} target="_blank" rel="noopener" className="rounded-full bg-white/[0.06] border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/[0.10] transition-all">
                𝕏 Twitter
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://embir.xyz/grindr-vs-alternatives`} target="_blank" rel="noopener" className="rounded-full bg-white/[0.06] border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/[0.10] transition-all">
                📘 Facebook
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent("Grindr vs Alternatives — le comparatif qui dit la vérité 😳 https://embir.xyz/grindr-vs-alternatives")}`} target="_blank" rel="noopener" className="rounded-full bg-white/[0.06] border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/[0.10] transition-all">
                📱 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
