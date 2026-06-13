import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Meilleurs Bars Gay Lyon — Top Adresses 2026 | Embir",
  description: "Guide complet des meilleurs bars gay à Lyon. Boîtes de nuit, bars branchés, lieux de rencontre où sortir ce soir.",
  keywords: ["bars gay lyon", "soirée gay lyon", "lyon vie nocturne gay"],
  alternates: { canonical: "https://embir.xyz/bars-gay/lyon" },
};

export default function GayBarsPage() {
  const bars = "L'Aventure, Le Wagg, L'Evêché, Le 202, Le Foxtrot".split(", ");
  const hoods = "Presqu'île, Vieux Lyon, Guillotière, Croix-Rousse".split(", ");
  
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Guide des bars gay à 
            <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">Lyon</span>
          </h1>
          
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Tu cherches les meilleurs bars et boîtes gay à Lyon ? Voici notre guide complet pour sortir
            et rencontrer d&apos;autres mecs.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🍸</div>
              <div className="text-white font-bold">L'Aventure</div>
              <div className="text-white/40 text-sm mt-1">Bar recommandé #1</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">📍</div>
              <div className="text-white font-bold">Presqu'île</div>
              <div className="text-white/40 text-sm mt-1">Quartier gay-friendly</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
               
              <div className="text-white font-bold">5+ bars</div>
              <div className="text-white/40 text-sm mt-1">Adresses recommandées</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Top bars et boîtes gay à Lyon</h2>
            <div className="space-y-4">
              {bars.map((bar, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">#{i + 1}</span>
                  <p className="text-white font-medium">{bar}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Quartiers gay-friendly à Lyon</h2>
            <div className="flex flex-wrap gap-2">
              {hoods.map((hood, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">{hood}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Planifie ta soirée sur Embir</h2>
            <p className="text-white/50 mb-6">100% gratuit, 0 pub, 0 abonnement.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]">
              Créer mon profil gratuitement
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
