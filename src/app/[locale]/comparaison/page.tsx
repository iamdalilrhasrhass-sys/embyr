"use client";
import ScrollReveal from "@/components/motion/ScrollReveal";

const ROWS = [
  { label: "Design", divineva: "PHP vieillot, tableaux HTML, années 2000", feminya: "Interface premium, Aurora-Bubble C, glassmorphism, animations fluides", winner: "feminya" },
  { label: "Mobile", divineva: "Non responsive, zoom obligatoire sur téléphone", feminya: "100% responsive, PWA, app-like, 100dvh, safe-area", winner: "feminya" },
  { label: "Vérification profils", divineva: "Aucune, des dizaines de faux comptes", feminya: "Selfie avec code unique, modération humaine, badge Vérifié", winner: "feminya" },
  { label: "Premium", divineva: "Paiement opaque, renouvellement forcé", feminya: "Stripe 3D Secure, 4.99€ découverte, sans engagement, transparent", winner: "feminya" },
  { label: "Inclusivité", divineva: "Aucune mention, communauté non protégée", feminya: "Célébration de TOUTES les femmes, trans incluses, modération stricte", winner: "feminya" },
  { label: "Messagerie", divineva: "Basique, pas de chiffrement, pas de vocal", feminya: "Texte, vocal, appels, visio. Chiffrée. Premium.", winner: "feminya" },
  { label: "Support", divineva: "Inexistant, pas de modération", feminya: "Équipe humaine 7j/7, conciergerie pour Ambassadrices", winner: "feminya" },
  { label: "Communauté", divineva: "Annonces agressives, pubs, ambiance glauque", feminya: "Salons, forum, témoignages. Communauté bienveillante.", winner: "feminya" },
  { label: "Prix", divineva: "Flou, pas de tarifs clairs", feminya: "4.99€/7j · 14.99€/mois · 49.99€/an — tout affiché", winner: "feminya" },
];

export default function ComparaisonPage() {
  return (
    <main className="min-h-screen py-24 px-4" style={{background:"linear-gradient(180deg, #0a0010 0%, #100520 100%)"}}>
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4" style={{background:"rgba(168,85,247,0.2)", border:"1px solid rgba(168,85,247,0.3)", color:"#c4b5fd"}}>
              COMPARAISON OBJECTIVE
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4" style={{background:"linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
              Divineva vs Feminya
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              On ne va pas vous mentir. On a comparé. Voici la vérité.
            </p>
          </div>
        </ScrollReveal>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-4 px-4">
          <div className="text-white/30 text-sm font-semibold"></div>
          <div className="text-red-300/70 text-sm font-semibold text-center">Divineva</div>
          <div className="text-purple-300 text-sm font-semibold text-center">Feminya</div>
          <div className="text-white/20 text-sm font-semibold text-center"></div>
        </div>

        {ROWS.map((row, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-3 p-4 md:p-5 rounded-2xl transition-all hover:brightness-105" style={{background:row.winner==="feminya"?"rgba(139,92,246,0.08)":"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)"}}>
              <div className="text-white font-bold text-sm md:text-base flex items-center">{row.label}</div>
              <div className="text-white/40 text-xs md:text-sm flex items-center">
                <span className="md:hidden font-bold text-red-300/70 mr-2">Divineva :</span>
                {row.divineva}
              </div>
              <div className="text-white/80 text-xs md:text-sm flex items-center" style={row.winner==="feminya"?{color:"#c4b5fd"}:{}}>
                <span className="md:hidden font-bold text-purple-300 mr-2">Feminya :</span>
                {row.feminya}
              </div>
              <div className="flex items-center justify-center">
                {row.winner === "feminya" ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:"rgba(139,92,246,0.2)", color:"#a78bfa"}}>Feminya ✓</span>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        ))}

        {/* CTA */}
        <ScrollReveal delay={0.8}>
          <div className="text-center mt-12 p-8 rounded-3xl" style={{background:"rgba(139,92,246,0.05)", border:"2px solid rgba(139,92,246,0.15)"}}>
            <h2 className="text-2xl font-bold text-white mb-4">9-0. Le choix est vite fait.</h2>
            <p className="text-white/50 mb-6">Rejoins la plateforme pensée pour toi. Pas celle codée en 2005.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/auth/register" className="px-8 py-4 rounded-xl font-bold text-white text-lg" style={{background:"linear-gradient(135deg, #8b5cf6, #6366f1)", boxShadow:"0 0 40px rgba(139,92,246,0.3)"}}>
                Créer mon compte gratuit →
              </a>
              <a href="/ambassadrice" className="px-8 py-4 rounded-xl font-bold text-white text-lg" style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)"}}>
                Devenir Ambassadrice ✦
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
