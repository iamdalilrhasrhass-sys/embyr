"use client";
import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import PremiumBlurImage from "@/components/ui/PremiumBlurImage";
import { usePremium } from "@/hooks/usePremium";
import Link from "next/link";
export default function MembresPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ city: "", gender: "", minAge: "", maxAge: "", withPhoto: false });
  const { isPremium } = usePremium();
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.id) setMyId(d.id);
    }).catch(() => {});
  }, []);

  const fetchProfiles = useCallback(() => {
    const params = new URLSearchParams();
    params.set("limit", "20");
    if (filters.city) params.set("city", filters.city);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.minAge) params.set("minAge", filters.minAge);
    if (filters.maxAge) params.set("maxAge", filters.maxAge);
    setLoading(true); setError("");
    fetch(`/api/profiles?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setLoading(false); return; }
        setProfiles(data.profiles || []);
        setLoading(false);
      })
      .catch(() => { setError("Erreur réseau"); setLoading(false); });
  }, [filters]);

  useEffect(() => { fetchProfiles(); }, []);

  const resetFilters = () => {
    setFilters({ city: "", gender: "", minAge: "", maxAge: "", withPhoto: false });
  };

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <AppShell>
      <main className="min-h-screen text-white pt-20 pb-24" style={{ background: "var(--color-premium-dark)" }}>
        <div className="fixed inset-0 noise-overlay pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1" style={{
              background: "linear-gradient(135deg, #E2E8F0 55%, #ff5e36 82%, #ffa333 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Membres
            </h1>
            <p className="text-white/30 text-sm">
              {profiles.length} profil{profiles.length !== 1 ? "s" : ""} à découvrir · Paris d&apos;abord
            </p>
          </div>

          {/* Bannière accès gratuit */}
          {!isPremium && !loading && (
            <div className="block mb-5 px-4 py-2.5 rounded-xl text-sm border border-[#ff5e36]/15 bg-[#ff5e36]/[0.035] backdrop-blur-sm">
              <span className="text-white/50">
                Accès gratuit pour les connexions essentielles.{" "}
                <span className="text-[#ffa333]/90">
                  Invite des vrais profils Paris / IDF pour densifier la communauté.
                </span>
              </span>
              <Link href="/paris" className="ml-2 text-[#ffa333] underline underline-offset-4 hover:text-white">
                Voir la campagne
              </Link>
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-6">
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 focus:outline-none focus:border-white/20 transition-colors appearance-none"
            >
              <option value="">Genre</option>
              <option value="woman">Femme</option>
              <option value="man">Homme</option>
              <option value="non_binary">Non-binaire</option>
            </select>
            <input
              placeholder="Ville"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 w-24 focus:outline-none focus:border-white/20 transition-colors"
            />
            <input
              placeholder="Âge min"
              type="number"
              value={filters.minAge}
              onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 w-20 focus:outline-none focus:border-white/20 transition-colors"
            />
            <input
              placeholder="Âge max"
              type="number"
              value={filters.maxAge}
              onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 w-20 focus:outline-none focus:border-white/20 transition-colors"
            />
            <button
              onClick={fetchProfiles}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg, #ff1f5a, #ff5e36)" }}
            >
              Appliquer
            </button>
            {hasFilters && (
              <button onClick={resetFilters} className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors">
                Réinitialiser
              </button>
            )}
          </div>

          {/* Contenu */}
          {error && !loading ? (
            <div className="text-center py-20">
              <p className="text-white/40 mb-4">{error}</p>
              <button onClick={fetchProfiles} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #ff1f5a, #ff5e36)" }}>
                Réessayer
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-white/[0.02] border border-white/[0.03]">
                  <div className="aspect-[3/4] bg-white/[0.02]" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-24 bg-white/[0.04] rounded" />
                    <div className="h-3 w-32 bg-white/[0.02] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-tr from-[#ff1f5a] to-[#ff5e36] opacity-80 shadow-[0_0_30px_rgba(255,94,54,0.28)]" />
              <h2 className="text-xl font-bold text-white/70">Les premiers membres arrivent</h2>
              <p className="text-white/40 max-w-md mx-auto">
                {hasFilters
                  ? "Aucun profil ne correspond à tes critères. Élargis ta recherche."
                  : "La priorité est simple : de vrais profils à Paris. Complète ton profil, puis invite 2 ou 3 personnes fiables."
                }
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {!hasFilters && (
                  <Link href="/dashboard/profile"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #ff1f5a, #ff5e36)" }}>
                    Compléter mon profil
                  </Link>
                )}
                {!hasFilters && (
                  <Link href="/paris"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#ff5e36]/20 text-[#ffa333] hover:bg-[#ff5e36]/10 transition-colors">
                    Inviter les fondateurs
                  </Link>
                )}
                {hasFilters && (
                  <button onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/60 hover:text-white/90 transition-colors">
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((p: any) => {
                const photoUrl = p.publicPhotos?.[0] || p.avatar || null;
                const isNew = p.createdAt && (Date.now() - new Date(p.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
                return (
                  <Link
                    key={p.id || p.userId}
                    href={`/membres/${p.id || p.userId}`}
                    className="group rounded-2xl overflow-hidden border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm hover:border-[#ff5e36]/25 hover:bg-[#ff5e36]/[0.025] transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <PremiumBlurImage
                        src={photoUrl}
                        alt={p.username || p.displayName || "Membre"}
                        className="w-full h-full"
                      />
                      {isNew && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#ff5e36]/15 text-[#ffa333] border border-[#ff5e36]/20">
                            Nouveau
                          </span>
                        </div>
                      )}
                      {p.isOnline && (
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[9px] text-green-400/80">En ligne</span>
                        </div>
                      )}
                      {p.id && p.id === myId && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#ff5e36]/15 text-[#ffa333] border border-[#ff5e36]/20">
                            Mon profil
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors truncate">
                          {p.username || p.displayName || "Membre"}
                        </h3>
                        {p.isVerified && (
                          <span className="h-2 w-2 rounded-full bg-[#ff5e36] shadow-[0_0_10px_rgba(255,94,54,0.75)]" title="Vérifié" />
                        )}
                        {p.isPremium && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ff5e36]/10 text-[#ffa333] border border-[#ff5e36]/15">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/35">
                        {[p.age && `${p.age} ans`, p.city].filter(Boolean).join(" • ")}
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/30 group-hover:text-white/60 group-hover:bg-white/[0.04] px-2 py-1 -ml-2 rounded-lg transition-all">
                          Voir le profil
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
