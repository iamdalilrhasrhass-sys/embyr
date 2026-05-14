"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

export default function ProfileDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profiles")
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.id === id);
        setProfile(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleReport = async () => {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportedUserId: profile.userId || profile.id, reason: "Comportement suspect ou faux profil (Signalement Utilisateur)" })
      });
      if (res.ok) setReported(true);
      else if (res.status === 401) router.push("/auth/login");
    } catch(err) {
      console.error(err);
    }
  };

  const handleMessage = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: profile.userId || profile.id, content: "Bonjour !" })
      });
      if (res.ok) router.push("/messages");
      else if (res.status === 401) router.push("/auth/login");
    } catch(err) {}
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-premium-dark)]">
       <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[var(--color-premium-rose)] animate-spin"></div>
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[var(--color-premium-dark)]">
      <div className="text-6xl opacity-50 animate-pulse">📵</div>
      <h2 className="text-2xl font-bold">Profil introuvable</h2>
      <Link href="/profiles" className="text-[var(--color-premium-rose)] hover:underline">Retourner au catalogue</Link>
    </div>
  );

  const isVerified = profile.verified || profile.isVerified;
  const isPremium = profile.premium || profile.isPremium;
  const isOnline = profile.online || profile.onlineStatus;
  const isDiscreet = profile.isDiscreet;
  const availability = profile.availabilityLabel;
  const intentions = profile.intentions || [];
  const courtesyBadges = profile.courtesyBadges || [];

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 bg-[var(--color-premium-dark)]">
      {/* Background Decor */}
      <div className="absolute inset-0 noise-overlay"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-[var(--color-premium-rose)]/10 blur-[150px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute inset-0 soft-grid-bg opacity-30"></div>

      <div className="max-w-6xl mx-auto px-4 pt-12 relative z-10">
        <Reveal direction="down" delay={0.1}>
          <div className="mb-8">
            <Link href="/profiles" className="inline-flex items-center gap-2 text-[var(--color-premium-gray)] hover:text-white transition-colors glass-premium px-5 py-2.5 rounded-full premium-hover">
              <span>←</span> Retour aux profils
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: VISUAL (Gallery Placeholder) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Reveal delay={0.2} className="h-full">
              <div className="glass-premium rounded-[2.5rem] overflow-hidden aspect-[4/5] relative shadow-[0_20px_50px_rgba(0,0,0,0.4)] group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f2b] to-[#0a0410] z-0 transition-transform duration-1000 group-hover:scale-105"></div>
                 <div className={`absolute inset-0 flex items-center justify-center text-[8rem] opacity-20 z-0 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-30 ${isDiscreet ? 'filter blur-[30px]' : 'filter blur-[3px]'}`}>👤</div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                 {isDiscreet && (
                   <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                     <span className="text-4xl mb-4">🔒</span>
                     <p className="text-white font-bold mb-2">Profil Discret</p>
                     <p className="text-gray-300 text-sm mb-6 text-center px-6">Accès photos réservé aux membres Premium ou durant la fenêtre gratuite (00h-07h).</p>
                     <button className="bg-gradient-premium px-6 py-3 rounded-full font-bold text-sm premium-glow hover:scale-105 transition-transform text-white">Débloquer Premium</button>
                   </div>
                 )}
                 
                 {/* Badges Overlay */}
                 <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      {isPremium && <span className="bg-gradient-premium text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg premium-glow self-start">Premium</span>}
                      {profile.isNew && <span className="bg-white/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg self-start">Nouveau</span>}
                      {availability && (
                         <span className="bg-[var(--color-premium-purple)] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg premium-glow flex items-center gap-2 self-start mt-2">
                           <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Dispo : {availability}
                         </span>
                      )}
                    </div>
                 </div>

                 <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                   {isOnline ? (
                      <span className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse premium-glow"></span> Connecté(e)
                      </span>
                   ) : (
                      <span className="bg-black/60 backdrop-blur-xl border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-full shadow-lg">
                        Vu(e) {profile.lastSeen || "récemment"}
                      </span>
                   )}
                 </div>
              </div>
            </Reveal>
            
            {/* Action Buttons Desktop */}
            <Reveal delay={0.3} className="hidden lg:grid grid-cols-2 gap-4">
              <MagneticButton onClick={handleMessage}>
                <div className="w-full bg-gradient-premium hover:shadow-[0_0_30px_rgba(244,63,143,0.5)] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 premium-glow">
                  <span>✉️</span> Contacter
                </div>
              </MagneticButton>
              <MagneticButton>
                <div className="w-full glass-premium hover:bg-white/10 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-white premium-hover">
                  <span>⭐</span> Favori
                </div>
              </MagneticButton>
            </Reveal>
          </div>

          {/* RIGHT: INFORMATIONS */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Reveal delay={0.3} direction="left">
              <div className="glass-premium p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-premium-purple)]/20 rounded-full blur-[80px] animate-pulse-slow"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-4xl md:text-6xl font-extrabold flex items-center gap-3 mb-2 tracking-tight drop-shadow-lg">
                        {profile.pseudo || profile.username}
                        <span className="font-light text-gray-400 text-4xl">{profile.age}</span>
                        {isVerified && (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 ml-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]" title="Vérifié">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                          </div>
                        )}
                      </h1>
                      <p className="text-xl text-[var(--color-premium-gray)] flex items-center gap-2">
                        <span>📍</span> {profile.city || "Non précisé"} 
                        {profile.distance && <span className="text-sm border border-white/10 bg-white/5 px-3 py-1 rounded-full ml-2 backdrop-blur-sm">À {profile.distance}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Characteristics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <span className="text-xs text-[var(--color-premium-rose)] uppercase tracking-wider font-bold block mb-1">Catégorie</span>
                      <span className="font-bold text-lg">{profile.category || profile.genderIdentity || "Non précisé"}</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <span className="text-xs text-[var(--color-premium-rose)] uppercase tracking-wider font-bold block mb-1">Langues</span>
                      <span className="font-bold text-lg">{(profile.languages || ["Français"]).join(", ")}</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors sm:col-span-1 col-span-2">
                      <span className="text-xs text-[var(--color-premium-rose)] uppercase tracking-wider font-bold block mb-1">Inscription</span>
                      <span className="font-bold text-lg">Membre vérifié</span>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <span className="text-[var(--color-premium-rose)] premium-glow">✧</span> À propos
                    </h3>
                    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors duration-500">
                      <p className="text-gray-300 leading-relaxed text-lg font-light italic">
                        "{profile.description || "Ce membre n'a pas encore rédigé de présentation détaillée."}"
                      </p>
                    </div>
                  </div>

                  
                  {/* Courtesy Badges */}
                  {courtesyBadges.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-200">
                        🛡️ Confiance & Courtoisie
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {courtesyBadges.map((badge: string) => (
                          <span key={badge} className="px-4 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)] flex items-center gap-2">
                            ✓ {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intentions Validation */}
                  {intentions.length > 0 && (
                    <div className="mb-10 p-6 bg-white/5 border border-[var(--color-premium-purple)]/30 rounded-[2rem] shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                        🎯 Intentions & Compatibilité
                      </h3>
                      <p className="text-sm text-[var(--color-premium-gray)] mb-4">Avant d'engager la conversation, vérifiez si vos attentes correspondent :</p>
                      <div className="flex flex-wrap gap-2">
                        {intentions.map((intent: string) => (
                          <span key={intent} className="px-4 py-2 bg-[var(--color-premium-purple)]/20 border border-[var(--color-premium-purple)]/50 text-[var(--color-premium-purple)] rounded-xl text-sm font-bold">
                            {intent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

<div className="mb-4">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <span className="text-[var(--color-premium-purple)] premium-glow">✧</span> Tags & Envies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(profile.tags || []).map((tag: string) => (
                        <span key={tag} className="px-5 py-2.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                          {tag}
                        </span>
                      ))}
                      {(!profile.tags || profile.tags.length === 0) && (
                        <span className="text-gray-500 italic text-sm">Aucun tag renseigné</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            
            {/* Action Buttons Mobile */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
               <button onClick={handleMessage} className="bg-gradient-premium text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 premium-glow">
                 <span>✉️</span> Contacter
               </button>
               <button className="glass-premium font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-white">
                 <span>⭐</span> Favori
               </button>
            </div>
            
            {/* Trust & Safety Box */}
            <Reveal delay={0.4} direction="up">
              <div className="bg-[#1a0a14] border border-[var(--color-premium-rose)]/30 p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-[0_0_30px_rgba(244,63,143,0.05)] hover:border-[var(--color-premium-rose)]/50 transition-colors duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-premium-rose)]/10 rounded-full blur-[50px]"></div>
                <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                  <div className="w-14 h-14 bg-[var(--color-premium-rose)]/20 rounded-full flex items-center justify-center text-[var(--color-premium-rose)] text-2xl flex-shrink-0 border border-[var(--color-premium-rose)]/40 premium-glow">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">Votre sécurité avant tout</h4>
                    <p className="text-[var(--color-premium-gray)] mb-2 leading-relaxed">
                      Sur Embyr, les échanges sont confidentiels. Ne partagez jamais vos informations bancaires ou personnelles sensibles.
                    </p>
                    <p className="text-[var(--color-premium-rose)] font-bold mb-4 text-sm uppercase tracking-wide">
                      Tolérance zéro sur les comportements déplacés.
                    </p>
                    {reported ? (
                      <span className="text-green-400 text-sm font-bold flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg inline-flex">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Signalement reçu par notre équipe.
                      </span>
                    ) : (
                      <button onClick={handleReport} className="text-[var(--color-premium-rose)] hover:text-white text-sm transition-colors underline font-medium hover:no-underline">
                        Signaler un comportement abusif ou un faux profil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </div>
  );
}