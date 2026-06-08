"use client";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import TiltCard from "@/components/motion/TiltCard";

export default function PremiumPage() {
  return (
    <AppShell>
      <main className="min-h-screen text-white pt-20 pb-24" style={{ background: "var(--color-premium-dark)" }}>
        <div className="fixed inset-0 noise-overlay pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex rounded-full border border-[#ff5e36]/25 bg-[#ff5e36]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#ffa333]">
              🔥 Fondateurs d&apos;abord
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
              style={{ background: "linear-gradient(135deg, #FFFFFF 55%, #ff5e36 78%, #ffa333 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Gratuit pendant le lancement
            </h1>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              Avant de vendre du Premium, embir.xyz doit réussir le plus important :
              créer une vraie communauté active à Paris.
            </p>
          </div>

          {/* Gratuit pendant le lancement */}
          <div className="rounded-2xl p-6 md:p-8 mb-8 border border-green-500/10 bg-green-500/[0.02] backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎁</span>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Gratuit pendant le lancement</h2>
                <p className="text-white/50">
                  Tu peux créer ton profil, découvrir les membres et utiliser les
                  fonctions essentielles gratuitement pendant la phase de lancement.
                </p>
                <Link href="/paris" className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #ff1f5a, #ff5e36)" }}>
                  Rejoindre les fondateurs Paris
                </Link>
              </div>
            </div>
          </div>

          {/* Avantages Premium à venir */}
          <h2 className="text-2xl font-bold text-white mb-6">Ce qui restera précieux plus tard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { title: "Boost de profil", desc: "Plus de visibilité dans les résultats", icon: "🚀" },
              { title: "Voir les visiteurs", desc: "Sache qui consulte ton profil", icon: "👁️" },
              { title: "Filtres avancés", desc: "Recherche par centres d'intérêt", icon: "🔍" },
              { title: "Albums privés", desc: "Partage des photos en privé", icon: "🔒" },
              { title: "Mode invisible", desc: "Navigue discrètement", icon: "🕶️" },
              { title: "Badge vérifié", desc: "Profil certifié authentique", icon: "🛡️" },
              { title: "Mise en avant", desc: "Apparais en priorité", icon: "⭐" },
              { title: "Messages illimités", desc: "Aucune limite d'échange", icon: "💬" },
            ].map((item) => (
              <TiltCard key={item.title} className="emb-card rounded-2xl p-5 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="text-xs text-white/40 mt-1">{item.desc}</p>
              </TiltCard>
            ))}
          </div>

          {/* Membres fondateurs */}
          <div className="rounded-2xl p-6 md:p-8 border border-amber-500/10 bg-amber-500/[0.02] backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">✦</span>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Membres fondateurs</h2>
                <p className="text-white/50">
                  Les premiers profils réels à Paris auront un statut fondateur.
                  C&apos;est cette base qui décidera quoi construire avant toute option payante.
                </p>
                <Link href="/paris" className="mt-4 inline-flex rounded-xl border border-amber-500/20 px-5 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-500/10">
                  Voir la campagne Paris
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
