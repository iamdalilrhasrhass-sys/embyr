"use client";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

export default function InviterPage() {
  const message = "Je viens de rejoindre Embyr, une nouvelle app de rencontre gay gratuite pendant son lancement. Rejoins les premiers membres : https://embir.xyz";
  const lien = "https://embir.xyz";

  const copier = (texte: string, label: string) => {
    navigator.clipboard.writeText(texte);
    alert(`${label} copié !`);
  };

  return (
    <AppShell>
      <main className="min-h-screen text-white pt-20 pb-24" style={{ background: "var(--color-premium-dark)" }}>
        <div className="fixed inset-0 noise-overlay pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
            style={{ background: "linear-gradient(135deg, #E2E8F0 60%, #06B6D4 80%, #6366F1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Invite tes amis sur Embyr
          </h1>
          <p className="text-white/40 mb-8">
            Embyr est gratuit pendant le lancement. Invite quelques personnes
            à rejoindre les premiers membres.
          </p>

          {/* Message copiable */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-3">Message à partager</h2>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 text-sm mb-4 whitespace-pre-wrap">
              {message}
            </div>
            <button
              onClick={() => copier(message, "Message")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
              📋 Copier le message
            </button>
          </div>

          {/* Lien */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-3">Lien direct</h2>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-cyan-400 text-sm mb-4 break-all">
              {lien}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => copier(lien, "Lien")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/[0.05] transition-colors">
                🔗 Copier le lien
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                💬 Partager WhatsApp
              </a>
              <a
                href={`sms:?body=${encodeURIComponent(message)}`}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/[0.05] transition-colors">
                📱 Partager par SMS
              </a>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-5">
            <p className="text-xs text-amber-400/70">
              ✦ Les premiers membres actifs recevront le badge Fondateur et
              des avantages Premium offerts lors du lancement des options payantes.
            </p>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
