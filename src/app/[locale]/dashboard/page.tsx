"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Particles3D from "@/components/Particles3D";
import { AuroraBubbles } from "@/components/VibeEffects";

function computeProfileCompletion(profile: any): number {
  if (!profile) return 0;
  let score = 0;
  let total = 7;
  if (profile.username || profile.displayName) score++;
  if (profile.age) score++;
  if (profile.city) score++;
  if (profile.description && profile.description.length > 10) score++;
  if (profile.genderIdentity) score++;
  if (profile.publicPhotos && profile.publicPhotos.length > 0) score++;
  if (profile.isVerified) score++;
  return Math.round((score / total) * 100);
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({ views: 0, favorites: 0, conversations: 0 });

  useEffect(() => {
    fetch("/api/profile/me")
      .then(res => {
        if (res.status === 401) { router.push("/auth/login?redirect=/dashboard"); return null; }
        return res.json();
      })
      .then(data => {
        if (data) setProfile(data);
        setAuthChecked(true);
      })
      .catch(() => { router.push("/auth/login?redirect=/dashboard"); });
  }, []);

  useEffect(() => {
    if (!profile) return;
    // Get message count
    fetch("/api/messages").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setStats(prev => ({ ...prev, conversations: d.length }));
    }).catch(() => {});
    // Get favorites count
    fetch("/api/favorites").then(r => r.json()).then(d => {
      if (d.favorites) setStats(prev => ({ ...prev, favorites: d.favorites.length }));
    }).catch(() => {});
  }, [profile]);

  const completion = computeProfileCompletion(profile);

  if (!authChecked) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{background:"radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)"}}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full border border-[#ff5e36]/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-[#d4a574]/20 animate-ping absolute" />
          <div className="w-8 h-8 rounded-full bg-[#ff5e36]/10 backdrop-blur-sm" />
        </div>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">Chargement...</span>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden" style={{background:"radial-gradient(ellipse at 50% 20%, #0f0718 0%, #080212 50%, #020005 100%)"}}>
      {/* ═══════════ COCKPIT BACKGROUND ═══════════ */}
      {/* Liquid gradient mesh */}
      <div className="emb-liquid-mesh" />

      {/* 3D Particles */}
      <Particles3D count={70} />

      {/* Aurora Bubbles */}
      <AuroraBubbles count={24} colors={["#ffa333","#ff5e36","#ff1f5a","#d4a574","#c4956a","#f59e0b"]} />

      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none rounded-full opacity-[0.07]"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(255,94,54,0.5) 0%, transparent 60%)",
          top: "-15%",
          right: "-10%",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full opacity-[0.05]"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 60%)",
          bottom: "10%",
          left: "-8%",
          filter: "blur(100px)",
        }}
      />

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-10">
        {/* ── Badge Row ── */}
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="emb-float-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] bg-[#ff5e36]/10 text-[#ffa333] border border-[#ff5e36]/20">
            <span className="w-1.5 h-1.5 bg-[#ff5e36] rounded-full animate-pulse shadow-[0_0_12px_rgba(255,94,54,0.8)]" />
            Accès lancement gratuit
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            ✦ Membre fondateur
          </span>
        </div>

        {/* ── Supernova Title ── */}
        <h1 className="emb-super-title text-4xl sm:text-5xl md:text-6xl text-white mb-3">
          <span className="emb-word">Bienvenue</span>{" "}
          <span className="emb-word emb-gradient-text-super">sur</span>{" "}
          <span className="emb-word emb-gradient-text-super">embir.xyz</span>
        </h1>
        <p className="text-white/25 text-sm mb-10 max-w-2xl leading-relaxed">
          Ton accès lancement gratuit est actif. Complète ton profil pour être visible
          et commencer à rencontrer les premiers membres.
        </p>

        {/* ── Profile Completion ── PREMIUM PROGRESS BAR ── */}
        {completion < 100 && (
          <div className="emb-glass-extreme rounded-2xl p-6 mb-10 group">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-semibold text-white">Profil complété à {completion}%</span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#d4a574]/70">
                {completion < 40 ? "Commence par ajouter tes infos" : completion < 70 ? "Presque ! Ajoute une photo" : "Ajoute une description"}
              </span>
            </div>
            {/* Premium progress bar */}
            <div className="relative w-full h-3 rounded-full bg-white/[0.04] overflow-hidden backdrop-blur-sm">
              {/* Glow behind the fill */}
              <div
                className="absolute inset-0 rounded-full opacity-60 blur-sm transition-all duration-700"
                style={{
                  width: `${completion}%`,
                  background: "linear-gradient(90deg, #ff1f5a, #ff5e36, #ffa333, #d4a574)",
                }}
              />
              {/* Fill bar */}
              <div
                className="relative h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${completion}%`,
                  background: "linear-gradient(90deg, #ff1f5a 0%, #ff5e36 40%, #ffa333 70%, #d4a574 100%)",
                  boxShadow: "0 0 30px rgba(255,94,54,0.5), 0 0 60px rgba(255,163,51,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {/* Shimmer effect */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 55%, transparent 100%)",
                    animation: "shimmer 2s ease-in-out infinite",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>
            </div>
            {/* Tick marks */}
            <div className="flex justify-between mt-2 px-0.5">
              {[25, 50, 75, 100].map(mark => (
                <div key={mark} className="flex flex-col items-center gap-1">
                  <div
                    className="w-px h-1.5 rounded-full transition-all duration-500"
                    style={{
                      background: completion >= mark
                        ? "linear-gradient(180deg, #ffa333, #ff5e36)"
                        : "rgba(255,255,255,0.08)",
                      boxShadow: completion >= mark ? "0 0 4px rgba(255,94,54,0.4)" : "none",
                    }}
                  />
                  <span
                    className="text-[8px] font-mono transition-colors duration-500"
                    style={{ color: completion >= mark ? "#d4a574" : "rgba(255,255,255,0.12)" }}
                  >
                    {mark}%
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-[#ff5e36] hover:text-[#ffa333] transition-all duration-300 group/link"
            >
              <span>Compléter mon profil</span>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </div>
        )}

        {/* ── Profile 100% Complete Celebration ── */}
        {completion === 100 && (
          <div className="emb-glass-extreme rounded-2xl p-6 mb-10 border-[#d4a574]/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a574]/20 to-[#ffa333]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#d4a574]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-[#d4a574]">Profil 100% complété</span>
                <p className="text-[10px] text-white/20 mt-0.5">Super ! Ton profil est visible par la communauté</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ STATS CARDS — EMB-GLASS-EXTREME ═══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Views */}
          <div className="emb-glass-extreme rounded-2xl p-6 text-center group cursor-default">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15 mb-3">Vues du profil</div>
            <div className="emb-stat-super text-4xl sm:text-5xl">—</div>
            <div className="mt-2 h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#d4a574]/20 to-transparent" />
          </div>

          {/* Favorites */}
          <div className="emb-glass-extreme rounded-2xl p-6 text-center group cursor-default">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15 mb-3">Favoris</div>
            <div className="emb-stat-super text-4xl sm:text-5xl">{stats.favorites || "—"}</div>
            <div className="mt-2 h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#d4a574]/20 to-transparent" />
          </div>

          {/* Verified */}
          <div className="emb-glass-extreme rounded-2xl p-6 text-center group cursor-default">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15 mb-3">Vérifié</div>
            <div className="emb-stat-super text-4xl sm:text-5xl">
              {profile?.isVerified ? (
                <span className="text-[#d4a574]" style={{filter:"drop-shadow(0 0 12px rgba(212,165,116,0.4))"}}>✓</span>
              ) : (
                <span className="text-white/10">—</span>
              )}
            </div>
            <div className="mt-2 h-1 w-10 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#d4a574]/20 to-transparent" />
          </div>
        </div>

        {/* ═══════════ QUICK-ACTION CARDS ═══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Mon Profil */}
          <Link href="/dashboard/profile" className="emb-glass-extreme rounded-2xl p-6 group cursor-pointer no-underline">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff1f5a]/15 to-[#ff5e36]/10 text-[#ff5e36] transition-all duration-500 group-hover:scale-110 group-hover:from-[#ff1f5a]/25 group-hover:to-[#ff5e36]/20 group-hover:shadow-[0_0_40px_rgba(255,31,90,0.2)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </div>
            <h3 className="font-serif text-lg font-medium tracking-[-0.02em] text-white mb-1 group-hover:text-[#d4a574] transition-colors duration-500">
              Mon Profil
            </h3>
            <p className="text-xs text-white/20 leading-relaxed mb-4">Photos, description, préférences</p>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#ff5e36] group-hover:text-[#ffa333] transition-all duration-300">
              <span>{completion < 50 ? "Compléter" : "Modifier"}</span>
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </div>
          </Link>

          {/* Messages */}
          <Link href="/messages" className="emb-glass-extreme rounded-2xl p-6 group cursor-pointer no-underline">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5e36]/15 to-[#ffa333]/10 text-[#ffa333] transition-all duration-500 group-hover:scale-110 group-hover:from-[#ff5e36]/25 group-hover:to-[#ffa333]/20 group-hover:shadow-[0_0_40px_rgba(255,163,51,0.2)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
              </svg>
            </div>
            <h3 className="font-serif text-lg font-medium tracking-[-0.02em] text-white mb-1 group-hover:text-[#d4a574] transition-colors duration-500">
              Messages
            </h3>
            <p className="text-xs text-white/20 leading-relaxed mb-4">
              {stats.conversations > 0 ? `${stats.conversations} conversation${stats.conversations > 1 ? 's' : ''}` : "Échange librement"}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#ff5e36] group-hover:text-[#ffa333] transition-all duration-300">
              <span>Voir</span>
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </div>
          </Link>

          {/* Membres */}
          <Link href="/membres" className="emb-glass-extreme rounded-2xl p-6 group cursor-pointer no-underline">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a574]/15 to-[#c4956a]/10 text-[#d4a574] transition-all duration-500 group-hover:scale-110 group-hover:from-[#d4a574]/25 group-hover:to-[#c4956a]/20 group-hover:shadow-[0_0_40px_rgba(212,165,116,0.2)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
              </svg>
            </div>
            <h3 className="font-serif text-lg font-medium tracking-[-0.02em] text-white mb-1 group-hover:text-[#d4a574] transition-colors duration-500">
              Membres
            </h3>
            <p className="text-xs text-white/20 leading-relaxed mb-4">Découvre la communauté</p>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#ff5e36] group-hover:text-[#ffa333] transition-all duration-300">
              <span>Explorer</span>
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </div>
          </Link>

          {/* Premium */}
          <Link href="/premium" className="emb-glass-extreme rounded-2xl p-6 group cursor-pointer no-underline">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffa333]/15 to-[#ff1f5a]/10 text-[#ffa333] transition-all duration-500 group-hover:scale-110 group-hover:from-[#ffa333]/25 group-hover:to-[#ff1f5a]/20 group-hover:shadow-[0_0_40px_rgba(255,163,51,0.25)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
              </svg>
            </div>
            <h3 className="font-serif text-lg font-medium tracking-[-0.02em] text-white mb-1 group-hover:text-[#d4a574] transition-colors duration-500">
              Premium bientôt
            </h3>
            <p className="text-xs text-white/20 leading-relaxed mb-4">Avantages à venir pour les fondateurs</p>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#ffa333] group-hover:text-[#ffe0b2] transition-all duration-300">
              <span>Découvrir</span>
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* ═══════════ INVITE SECTION ═══════════ */}
        <div className="emb-glass-extreme rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-medium tracking-[-0.02em] text-white mb-1">
                Invite tes amis
              </h2>
              <p className="text-white/20 text-sm max-w-lg">
                embir.xyz est gratuit pendant le lancement. Partage le lien avec
                quelques personnes pour agrandir la communauté.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { navigator.clipboard.writeText("Je viens de rejoindre embir.xyz, une nouvelle plateforme de rencontre moderne et gratuite pendant son lancement. Tu peux créer ton profil ici : https://embir.xyz"); }}
                className="px-5 py-3 rounded-xl text-[10px] font-semibold border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-300"
              >
                Copier le message
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText("https://embir.xyz"); }}
                className="px-5 py-3 rounded-xl text-[10px] font-semibold border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-300"
              >
                Copier le lien
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════ GLOW DIVIDER ═══════════ */}
        <div className="emb-glow-divider mb-8" />

        {/* ═══════════ STATISTICS SECTION ═══════════ */}
        <div className="emb-glass-extreme rounded-2xl p-8">
          <h2 className="font-serif text-xl font-medium tracking-[-0.02em] text-white mb-6">
            Statistiques
          </h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="emb-stat-super text-4xl sm:text-5xl mb-2">—</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15">Vues</div>
            </div>
            <div>
              <div className="emb-stat-super text-4xl sm:text-5xl mb-2">{stats.favorites || "—"}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15">Favoris</div>
            </div>
            <div>
              <div className="emb-stat-super text-4xl sm:text-5xl mb-2">
                {profile?.isVerified ? '✓' : '—'}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15">Vérifié</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
