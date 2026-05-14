"use client";
import { PRICING, FAST_OPTIONS, PREMIUM_FEATURES, formatPriceEUR } from "@/lib/pricing";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TiltCard } from "@/components/motion/TiltCard";
import { MagneticButton } from "@/components/motion/MagneticButton";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: planId })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur de paiement. L'administrateur doit configurer Stripe.");
        setLoading(null);
      }
    } catch (e) {
      alert("Erreur réseau");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-premium-dark)] relative overflow-hidden pb-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 noise-overlay"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-premium-rose)]/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[var(--color-premium-purple)]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-[var(--color-premium-rose)]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 soft-grid-bg opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 pt-24 relative z-10">
        
        {/* A. Hero pricing */}
        <div className="text-center mb-20">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <span className="glass-premium text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                Jusqu'à 25 % moins cher que les plateformes classiques
              </span>
              <span className="bg-[#1c0f2b] text-[var(--color-premium-purple)] px-6 py-2 rounded-full text-sm font-bold border border-[var(--color-premium-purple)]/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-premium-purple)] rounded-full animate-pulse"></span> 🌙 Night Club : Gratuit de 00h00 à 07h00
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-xl">
              Plus <span className="text-gradient">premium</span>.<br />
              Plus discret. Moins cher.
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-premium-gray)] max-w-3xl mx-auto leading-relaxed">
              Accédez aux fonctionnalités essentielles de Embyr avec des prix clairs, accessibles et sans engagement.
            </p>
          </Reveal>
        </div>

        {/* B. Bloc fonctionnalités premium */}
        <Reveal delay={0.2}>
          <div className="mb-24 max-w-4xl mx-auto">
            <div className="glass-premium rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-[var(--color-premium-rose)]/30 shadow-[0_0_50px_rgba(244,63,143,0.15)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-premium opacity-20 blur-[100px] animate-pulse-slow"></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white drop-shadow-md">Tout ce qui est inclus dans <span className="text-gradient">Premium</span></h2>
              <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 relative z-10">
                {PREMIUM_FEATURES.map((feature, idx) => (
                  <StaggerItem key={idx}>
                    <div className="flex items-start group">
                      <svg className="w-6 h-6 text-[var(--color-premium-rose)] mt-0.5 mr-3 shrink-0 group-hover:scale-125 transition-transform drop-shadow-[0_0_8px_rgba(244,63,143,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[var(--color-premium-white)]/90 text-lg">{feature}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </Reveal>

        {/* C. Grille principale des abonnements */}
        <div className="mb-24">
          <Reveal>
            <h2 className="text-4xl font-bold mb-12 text-center drop-shadow-md">Abonnements Premium</h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING.map((plan) => (
              <StaggerItem key={plan.id}>
                <TiltCard tiltScale={0.5} className="h-full">
                  <div 
                    className={`h-full glass-premium rounded-3xl p-8 relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                      plan.recommended ? 'border-[var(--color-premium-rose)] shadow-[0_0_40px_rgba(244,63,143,0.3)] bg-gradient-to-b from-white/10 to-transparent' : 'hover:border-white/30'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-premium text-white px-5 py-1.5 rounded-full text-sm font-black shadow-[0_0_20px_rgba(244,63,143,0.5)] whitespace-nowrap uppercase tracking-wider">
                        ⭐ Le plus choisi
                      </div>
                    )}
                    {plan.id === "premium_12m" && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-premium-purple)] text-white px-5 py-1.5 rounded-full text-sm font-black shadow-lg whitespace-nowrap uppercase tracking-wider">
                        Le plus économique
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold mb-1 mt-4">{plan.name}</h3>
                    {plan.mention && <p className="text-sm text-[var(--color-premium-rose)] font-bold mb-4 uppercase tracking-wider">{plan.mention}</p>}
                    
                    <div className="mb-4">
                      <span className="text-5xl font-extrabold drop-shadow-md">{formatPriceEUR(plan.price)}</span>
                    </div>
                    
                    <div className="text-sm text-[var(--color-premium-gray)] mb-8 h-10 italic">
                      {plan.compareLabel}
                    </div>
                    
                    <MagneticButton className="mt-auto w-full">
                      <button 
                        onClick={() => handleCheckout(plan.id)}
                        disabled={loading === plan.id}
                        className={`w-full py-4 rounded-xl font-bold transition-all text-lg ${
                          plan.recommended 
                            ? 'bg-gradient-premium hover:opacity-90 text-white shadow-[0_0_20px_rgba(244,63,143,0.4)]' 
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                        }`}
                      >
                        {loading === plan.id ? "Redirection..." : `Choisir ${plan.name}`}
                      </button>
                    </MagneticButton>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* D. Offres 24h et options */}
        <Reveal delay={0.2}>
          <div className="mb-24 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Offres rapides et Visibilité</h2>
              <p className="text-[var(--color-premium-gray)] text-lg">Besoin d’un accès rapide ? Embyr propose aussi des options courtes, simples et moins chères.</p>
            </div>
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FAST_OPTIONS.map((opt) => (
                <StaggerItem key={opt.id}>
                  <div className="glass-premium rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors h-full group premium-hover">
                    <div>
                      <h4 className="font-bold text-xl mb-2">{opt.name}</h4>
                      <p className="text-[var(--color-premium-rose)] text-3xl font-bold mb-8 group-hover:scale-105 transition-transform origin-left">{formatPriceEUR(opt.price)}</p>
                    </div>
                    <button 
                      onClick={() => handleCheckout(opt.id)}
                      disabled={loading === opt.id}
                      className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-colors border border-white/10"
                    >
                      {loading === opt.id ? "..." : "Acheter"}
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Reveal>

        {/* E. Comparaison */}
        <Reveal>
          <div className="mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center drop-shadow-md">Comparez et choisissez l'évidence</h2>
            <div className="glass-premium rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-6 font-semibold text-[var(--color-premium-gray)] text-lg">Fonction</th>
                    <th className="p-6 font-semibold text-gray-400 text-lg">Plateformes classiques</th>
                    <th className="p-6 font-extrabold text-[var(--color-premium-rose)] text-xl">Embyr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-base md:text-lg">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">1 semaine</td>
                    <td className="p-6 text-gray-400">7,99 €</td>
                    <td className="p-6 font-bold text-white">4,99 €</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">1 mois</td>
                    <td className="p-6 text-gray-400">19,99 €</td>
                    <td className="p-6 font-bold text-white">14,99 €</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">3 mois</td>
                    <td className="p-6 text-gray-400">39,99 €</td>
                    <td className="p-6 font-bold text-white">29,99 €</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">12 mois</td>
                    <td className="p-6 text-gray-400">79,99 €</td>
                    <td className="p-6 font-bold text-white">49,99 €</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">Design moderne</td>
                    <td className="p-6 text-gray-400">Basique</td>
                    <td className="p-6 font-bold text-[var(--color-premium-rose)]">Premium</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">Accès nuit</td>
                    <td className="p-6 text-gray-400">Non mis en avant</td>
                    <td className="p-6 font-bold text-[var(--color-premium-purple)]">Gratuit 00h00–07h00</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6">Confidentialité</td>
                    <td className="p-6 text-gray-400">Standard</td>
                    <td className="p-6 font-bold text-white">Renforcée</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-6 border-b-0">Navigation mobile</td>
                    <td className="p-6 text-gray-400 border-b-0">Moyenne</td>
                    <td className="p-6 font-bold text-white border-b-0">Pensée mobile</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* F. Bloc paiement sécurisé */}
        <Reveal delay={0.2} direction="up">
          <div className="mb-24 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-5 rounded-full bg-white/5 mb-6 border border-white/10 premium-glow">
              <svg className="w-10 h-10 text-[var(--color-premium-rose)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
        <Reveal delay={0.3}>
          <div className="mt-16 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-premium-rose)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="z-10 text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Accès sans Carte Bancaire</h3>
              <p className="text-gray-300">Paiement par SMS surtaxé ou Appel (Bientôt disponible)</p>
            </div>
            <div className="z-10 w-full md:w-auto">
              <div className="flex gap-4">
                <button disabled className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center border border-white/10 cursor-not-allowed opacity-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  Payer par SMS
                </button>
                <button className="bg-[var(--color-premium-rose)] hover:bg-[var(--color-premium-purple)] text-white font-medium py-3 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(244,63,143,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  J'ai un code d'accès
                </button>
              </div>
            </div>
          </div>
        </Reveal>


        <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Paiement 100% sécurisé</h2>
            <p className="text-[var(--color-premium-gray)] mb-6 max-w-xl mx-auto text-lg">
              Vos transactions sont chiffrées et sécurisées par Stripe. Prix clairs, données protégées. Libellé discret sur votre relevé bancaire.
            </p>
            <p className="text-sm text-gray-400 italic">
              Les conditions de renouvellement sont affichées avant paiement.
            </p>
          </div>
        </Reveal>

        {/* G. FAQ pricing */}
        <Reveal>
          <div className="max-w-4xl mx-auto mb-10">
            <h2 className="text-4xl font-bold mb-12 text-center drop-shadow-md">Questions fréquentes</h2>
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: "Est-ce sans engagement ?", a: "Les conditions de renouvellement sont clairement affichées lors du paiement. Vous pouvez gérer vos préférences d'abonnement à tout moment depuis votre compte." },
                { q: "Que se passe-t-il entre 00h00 et 07h00 ?", a: "Selon les règles de la plateforme, l'accès aux fonctionnalités essentielles est gratuit durant ces horaires pour faciliter les échanges nocturnes." },
                { q: "Puis-je annuler ?", a: "Oui, vous pouvez annuler un éventuel renouvellement automatique d'un simple clic dans vos paramètres de compte, sans conditions cachées." },
                { q: "Les paiements sont-ils sécurisés ?", a: "Absolument. Nous utilisons Stripe, leader mondial du paiement en ligne. Aucune donnée bancaire n'est stockée sur nos serveurs." },
                { q: "Les profils sont-ils vérifiés ?", a: "La sécurité est notre priorité. Nos modérateurs et nos outils de détection vérifient continuellement la qualité des profils pour vous assurer une expérience premium." },
                { q: "Est-ce réservé aux majeurs ?", a: "Oui, l'accès à Embyr est strictement réservé aux personnes majeures de plus de 18 ans." },
              ].map((faq, idx) => (
                <StaggerItem key={idx}>
                  <div className="glass-premium p-8 rounded-3xl h-full border border-white/5 hover:border-white/20 transition-colors">
                    <h3 className="font-bold text-xl mb-3 text-[var(--color-premium-rose)]">{faq.q}</h3>
                    <p className="text-[var(--color-premium-gray)] leading-relaxed">{faq.a}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Reveal>

      </div>
    </div>
  );
}