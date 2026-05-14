"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { isFreeNightAccess } from "@/lib/freeAccess";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TiltCard } from "@/components/motion/TiltCard";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  
  const isFree = isFreeNightAccess();

  useEffect(() => {
    fetch("/api/profiles")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProfiles = profiles.filter(p => {
    // Category match
    const cat = p.category || p.genderIdentity || "AUTRE";
    if (category !== "all" && !cat.toLowerCase().includes(category.toLowerCase())) return false;
    
    // Search match
    const pseudo = (p.pseudo || p.username || "").toLowerCase();
    const city = (p.city || "").toLowerCase();
    const q = search.toLowerCase();
    if (search && !pseudo.includes(q) && !city.includes(q)) return false;
    
    // Boolean filters
    if (onlyVerified && !(p.verified || p.isVerified)) return false;
    if (onlyOnline && !(p.online || p.onlineStatus)) return false;
    if (onlyAvailable && !p.availabilityLabel) return false;
    
    return true;
  }).sort((a, b) => (b.availabilityLabel ? 1 : 0) - (a.availabilityLabel ? 1 : 0));

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--color-premium-dark)]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 noise-overlay"></div>
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[var(--color-premium-rose)]/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[var(--color-premium-purple)]/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[var(--color-premium-rose)]/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 soft-grid-bg opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        {/* PREMIUM HEADER */}
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 glass-premium rounded-full px-6 py-2 mb-6">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-blue-400 premium-glow">✓</span> Profils Vérifiés
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
                🔒 Confidentialité
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className={`flex items-center gap-2 text-sm font-medium ${isFree ? 'text-[var(--color-premium-rose)] premium-glow' : 'text-gray-300'}`}>
                🌙 Accès Nuit
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl">
              Le Cercle <span className="text-gradient">Privé</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-premium-gray)] max-w-2xl mx-auto">
              Découvrez notre sélection de membres. Une communauté élégante, respectueuse et vérifiée.
            </p>
          </div>
        </Reveal>

        {/* FILTERS BAR (GLASSMORPHISM) */}
        <Reveal delay={0.2}>
          <div className="glass-premium p-4 md:p-6 rounded-3xl mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              <div className="w-full md:w-1/3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
                <input 
                  type="text" 
                  placeholder="Rechercher (Pseudo, Ville)..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-premium-rose)] focus:ring-1 focus:ring-[var(--color-premium-rose)]/50 text-white transition-all shadow-inner"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
                {['all', 'féminine', 'trans', 'femme'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)} 
                    className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all ${category === cat ? 'bg-gradient-premium text-white premium-glow scale-105' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4 w-full md:w-auto justify-center">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${onlyVerified ? 'bg-[var(--color-premium-rose)] shadow-[0_0_10px_rgba(244,63,143,0.5)]' : 'bg-white/10'}`} onClick={() => setOnlyVerified(!onlyVerified)}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${onlyVerified ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  Vérifiés
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${onlyOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} onClick={() => setOnlyOnline(!onlyOnline)}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${onlyOnline ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  En ligne
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${onlyAvailable ? 'bg-[var(--color-premium-purple)] shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`} onClick={() => setOnlyAvailable(!onlyAvailable)}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${onlyAvailable ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  Dispo maintenant
                </label>
              </div>
            </div>
          </div>
        </Reveal>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-[420px] bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : filteredProfiles.length === 0 ? (
          <Reveal>
            <div className="text-center py-24 glass-premium rounded-3xl border border-white/10">
              <div className="text-6xl mb-6 opacity-50 animate-pulse">✨</div>
              <h3 className="text-2xl font-bold mb-2">Aucun profil trouvé</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Élargissez vos critères de recherche pour découvrir de nouveaux membres fascinants.</p>
              <button onClick={() => {setSearch(""); setCategory("all"); setOnlyOnline(false); setOnlyVerified(false);}} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 border border-white/20">
                Réinitialiser les filtres
              </button>
            </div>
          </Reveal>
        ) : (
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProfiles.map((profile) => {
              const isVerified = profile.verified || profile.isVerified;
              const isPremium = profile.premium || profile.isPremium;
              const isOnline = profile.online || profile.onlineStatus;
              const isDiscreet = profile.isDiscreet;
              const availability = profile.availabilityLabel;
              
              return (
                <StaggerItem key={profile.id}>
                  <Link href={`/profiles/${profile.id}`} className="block h-full group perspective-1000">
                    <TiltCard tiltScale={0.8} className="relative glass-card rounded-3xl overflow-hidden h-[420px] glass-card-hover border border-white/5 group-hover:border-[var(--color-premium-rose)]/30 group-hover:shadow-[0_20px_40px_rgba(244,63,143,0.15)]">
                      
                      {/* Image/Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f2b] to-[#0a0410] z-0 transition-transform duration-700 group-hover:scale-105">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--color-premium-rose)] via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Placeholder Avatar logic */}
                      <div className={`absolute inset-0 flex items-start justify-center pt-16 z-0 opacity-20 transition-transform duration-700 group-hover:scale-110 ${isDiscreet ? 'filter blur-[15px]' : ''}`}>
                        <span className="text-9xl filter blur-[2px]">👤</span>
                      </div>
                      {isDiscreet && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-50">
                          <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white/80 border border-white/10">Mode Discret</span>
                        </div>
                      )}

                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-premium-dark)]/95 via-[var(--color-premium-dark)]/40 to-black/10 z-10"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          {profile.isNew && (
                            <span className="bg-white/90 text-black text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg self-start backdrop-blur-md">Nouveau</span>
                          )}
                          {availability && (
                            <span className="bg-[var(--color-premium-purple)] text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg self-start premium-glow flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> {availability}
                            </span>
                          )}
                          {isPremium && (
                            <span className="bg-gradient-premium text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg self-start premium-glow">Premium</span>
                          )}
                        </div>
                        {isOnline && (
                          <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded-full shadow-lg">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse premium-glow"></span> En ligne
                          </span>
                        )}
                      </div>

                      {/* Content Container */}
                      <div className="absolute inset-x-0 bottom-0 p-5 z-20 flex flex-col justify-end transform transition-transform duration-500">
                        
                        {/* Header Info */}
                        <div className="mb-2">
                          <h3 className="text-2xl font-bold text-white flex items-center gap-2 leading-none group-hover:text-[var(--color-premium-rose)] transition-colors">
                            {profile.pseudo || profile.username}
                            <span className="font-light opacity-80 text-xl text-white"> {profile.age}</span>
                            {isVerified && (
                              <svg className="w-5 h-5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                            )}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1.5 flex items-center gap-1.5">
                            <span className="opacity-70">📍</span> {profile.city || "Non précisé"} 
                            {profile.distance && <span className="opacity-50">• {profile.distance}</span>}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(profile.tags || []).slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-gray-200 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Hover Description */}
                        <div className="h-0 md:group-hover:h-12 overflow-hidden transition-all duration-300 ease-out md:opacity-0 md:group-hover:opacity-100 mb-0 md:group-hover:mb-4">
                           <p className="text-xs text-gray-300 line-clamp-2 italic leading-relaxed">
                             "{profile.description || "Découvrez mon profil pour en savoir plus..."}"
                           </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          <button className="flex-1 bg-white/10 group-hover:bg-gradient-premium text-white text-sm font-bold py-2.5 rounded-xl backdrop-blur-md transition-all duration-300 border border-white/10 group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(244,63,143,0.4)]">
                            Voir profil
                          </button>
                          <button className="w-11 flex-shrink-0 bg-white/10 hover:bg-white/20 flex items-center justify-center rounded-xl border border-white/10 transition-colors hover:scale-110 active:scale-95">
                            ⭐
                          </button>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </div>
    </div>
  );
}