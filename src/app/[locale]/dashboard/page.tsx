"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  if (!authChecked) return <div className="min-h-screen flex items-center justify-center text-white/40">Vérification...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      {/* Badge accès gratuit */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] bg-[#ff5e36]/10 text-[#ffa333] border border-[#ff5e36]/20">
          <span className="w-1.5 h-1.5 bg-[#ff5e36] rounded-full animate-pulse shadow-[0_0_12px_rgba(255,94,54,0.8)]" />
          Accès lancement gratuit
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ✦ Membre fondateur
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
        Bienvenue sur embir.xyz
      </h1>
      <p className="text-white/40 text-sm mb-6">
        Ton accès lancement gratuit est actif. Complète ton profil pour être visible
        et commencer à rencontrer les premiers membres.
      </p>

      {/* Progression profil */}
      {completion < 100 && (
        <div className="mb-8 p-5 rounded-2xl border border-[#ff5e36]/15 bg-[#ff5e36]/[0.04] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Profil complété à {completion}%</span>
            <span className="text-xs text-white/40">{completion < 40 ? "Commence par ajouter tes infos" : completion < 70 ? "Presque ! Ajoute une photo" : "Ajoute une description"}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completion}%`, background: "linear-gradient(90deg, #ff1f5a, #ff5e36, #ffa333)" }} />
          </div>
          <Link href="/dashboard/profile" className="inline-block mt-3 text-xs text-[#ff5e36] hover:text-[#ffa333] transition-colors">
            Compléter mon profil →
          </Link>
        </div>
      )}

      {/* Cartes d'action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/dashboard/profile" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
          <div className="mb-3 h-2 w-8 rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36]" />
          <h3 className="text-lg font-bold mb-1 text-white">Mon Profil</h3>
          <p className="text-white/40 text-sm">Photos, description, préférences</p>
          <span className="inline-block mt-3 text-xs text-[#ff5e36] group-hover:translate-x-1 transition-transform">
            {completion < 50 ? "Compléter →" : "Modifier →"}
          </span>
        </Link>

        <Link href="/messages" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
          <div className="mb-3 h-2 w-8 rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36]" />
          <h3 className="text-lg font-bold mb-1 text-white">Messages</h3>
          <p className="text-white/40 text-sm">
            {stats.conversations > 0 ? `${stats.conversations} conversation${stats.conversations > 1 ? 's' : ''}` : "Échange librement"}
          </p>
          <span className="inline-block mt-3 text-xs text-[#ff5e36] group-hover:translate-x-1 transition-transform">Voir →</span>
        </Link>

        <Link href="/membres" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
          <div className="mb-3 h-2 w-8 rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36]" />
          <h3 className="text-lg font-bold mb-1 text-white">Membres</h3>
          <p className="text-white/40 text-sm">Découvre la communauté</p>
          <span className="inline-block mt-3 text-xs text-[#ff5e36] group-hover:translate-x-1 transition-transform">Explorer →</span>
        </Link>

        <Link href="/premium" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 md:col-span-3 lg:col-span-1">
          <div className="mb-3 h-2 w-8 rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ffa333]" />
          <h3 className="text-lg font-bold mb-1 text-white">Premium bientôt</h3>
          <p className="text-white/40 text-sm">Avantages à venir pour les fondateurs</p>
          <span className="inline-block mt-3 text-xs text-[#ffa333] group-hover:translate-x-1 transition-transform">Découvrir →</span>
        </Link>
      </div>

      {/* Inviter */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Invite tes amis</h2>
            <p className="text-white/40 text-sm">
              embir.xyz est gratuit pendant le lancement. Partage le lien avec
              quelques personnes pour agrandir la communauté.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { navigator.clipboard.writeText("Je viens de rejoindre embir.xyz, une nouvelle plateforme de rencontre moderne et gratuite pendant son lancement. Tu peux créer ton profil ici : https://embir.xyz"); }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-white/70 hover:bg-white/[0.05] transition-colors"
            >
              Copier le message
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText("https://embir.xyz"); }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-white/70 hover:bg-white/[0.05] transition-colors"
            >
              Copier le lien
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8">
        <h2 className="text-xl font-bold mb-6">Statistiques</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/[0.03] p-4 rounded-xl">
            <div className="text-3xl font-bold mb-1">—</div>
            <div className="text-xs text-white/30">Vues</div>
          </div>
          <div className="bg-white/[0.03] p-4 rounded-xl">
            <div className="text-3xl font-bold mb-1">{stats.favorites || "—"}</div>
            <div className="text-xs text-white/30">Favoris</div>
          </div>
          <div className="bg-white/[0.03] p-4 rounded-xl">
            <div className="text-3xl font-bold mb-1">{profile?.isVerified ? '✓' : '—'}</div>
            <div className="text-xs text-white/30">Vérifié</div>
          </div>
        </div>
      </div>
    </div>
  );
}
