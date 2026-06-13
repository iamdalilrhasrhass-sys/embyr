"use client";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { useState } from "react";

export default function AmbassadeurPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen text-[var(--eb-text-primary)]" style={{background:"var(--eb-bg-base)"}}>
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center relative">
        <div className="absolute inset-0 opacity-20" style={{background:"radial-gradient(ellipse at 50% 50%, rgba(255,90,31,0.2) 0%, transparent 70%)"}} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-widest mb-6" style={{background:"linear-gradient(135deg, rgba(255,90,31,0.3), rgba(184,115,51,0.2))", border:"1px solid rgba(255,90,31,0.4)", color:"var(--eb-accent)"}}>
            🔥 PROGRAMME AMBASSADEUR — ÉDITION LIMITÉE
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper), var(--eb-gold))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
            Deviens Ambassadeur<br/>Embir
          </h1>
          <p className="text-xl text-[var(--eb-text-secondary)] max-w-2xl mx-auto mb-8">
            Rejoins le cercle privé des hommes qui façonnent la nouvelle référence des rencontres premium.
            Un statut exclusif, des avantages à vie, une communauté d'exception.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8" style={{background:"rgba(255,90,31,0.1)", border:"1px solid rgba(255,90,31,0.3)"}}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{background:"var(--eb-accent)"}} />
            <span style={{color:"var(--eb-accent)"}} className="font-semibold">⚠️ Plus que 8 places — Édition Mai 2026</span>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-gold))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
            Pourquoi devenir Ambassadeur ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {icon:"👑",title:"Avantages Fondateur",desc:"Accès prioritaire aux futures options Premium. Inclus pour les premiers membres actifs.",hl:"Badge Fondateur offert"},
              {icon:"💎",title:"Badge Fondateur Braise",desc:"Le badge le plus rare d'Embir. Visible sur ton profil.",hl:"Badge le plus rare"},
              {icon:"🚀",title:"Visibilité Maximale",desc:"Ton profil en premier. +300% de vues.",hl:"+300% visibilité"},
              {icon:"🎟️",title:"Accès Anticipé",desc:"Teste les features avant tout le monde.",hl:"Influence la roadmap"},
              {icon:"💌",title:"Messagerie Illimitée",desc:"Messages, vocaux, appels, visio. Sans limite.",hl:"Priorité absolue"},
              {icon:"🛡️",title:"Support Conciergerie",desc:"Une équipe dédiée 24/7 pour les Ambassadeurs.",hl:"Réponse -1h"},
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i*0.1}>
                <div className="p-8 rounded-2xl h-full transition-all hover:brightness-110" style={{background:"var(--eb-bg-elev-1)", border:"1px solid var(--eb-border-soft)"}}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-[var(--eb-text-secondary)] mb-3">{item.desc}</p>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{background:"linear-gradient(135deg, rgba(255,90,31,0.3), rgba(184,115,51,0.2))", color:"var(--eb-accent)"}}>{item.hl}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl p-8 md:p-12" style={{background:"var(--eb-bg-elev-1)", border:"1px solid rgba(255,90,31,0.2)", boxShadow:"0 0 80px rgba(255,90,31,0.1)"}}>
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              {submitted ? "🔥 Candidature envoyée !" : "Dépose ta candidature"}
            </h2>
            <p className="text-[var(--eb-text-secondary)] text-center mb-8">
              {submitted ? "Merci. Réponse sous 24h." : "2 minutes. Confidentiel. Réponse sous 24h."}
            </p>
            {!submitted ? (
              <form onSubmit={(e)=>{e.preventDefault();setSubmitted(true)}} className="space-y-5">
                <input placeholder="Ton prénom ou pseudo" className="w-full px-5 py-4 rounded-xl text-white border" style={{background:"var(--eb-bg-elev-2)", border:"1px solid var(--eb-border-soft)", fontSize:"16px"}} required />
                <input type="email" placeholder="Ton email" className="w-full px-5 py-4 rounded-xl text-white border" style={{background:"var(--eb-bg-elev-2)", border:"1px solid var(--eb-border-soft)", fontSize:"16px"}} required />
                <textarea placeholder="Pourquoi veux-tu devenir Ambassadeur Embir ? (2-3 phrases)" rows={4} className="w-full px-5 py-4 rounded-xl text-white border resize-none" style={{background:"var(--eb-bg-elev-2)", border:"1px solid var(--eb-border-soft)", fontSize:"16px"}} required />
                <button type="submit" className="w-full py-5 rounded-xl text-lg font-bold text-white transition-all hover:scale-[1.02]" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))", boxShadow:"0 0 40px rgba(255,90,31,0.3)"}}>
                  🔥 Envoyer ma candidature — Places limitées
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔥</div>
                <a href="/" className="inline-block px-8 py-4 rounded-xl text-white font-bold" style={{background:"var(--eb-bg-elev-2)", border:"1px solid var(--eb-border-soft)"}}>Retour à l'accueil</a>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
