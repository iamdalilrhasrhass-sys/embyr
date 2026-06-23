"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────────────────────────────────────────────────────────────
 * Embir — Dashboard multi-orientation & multi-intention
 *
 * Affiche un feed de profils compatibles (via /api/match/feed) filtrable par
 * intention. Cartes profil avec badges orientation / intents / vérifié, score
 * de compatibilité, raisons du match et actions Like / Voir profil / Passer.
 *
 * Les libellés (orientation / intents) sont en dur côté client : on n'importe
 * PAS @/lib/matching qui tirerait Prisma dans le bundle navigateur.
 * ─────────────────────────────────────────────────────────────────────────── */

const ORIENTATION_LABELS: Record<string, string> = {
  HETERO: "Hétéro",
  HOMOSEXUEL: "Homosexuel",
  LESBIENNE: "Lesbienne",
  BI: "Bi",
  QUEER: "Queer",
  PAN: "Pan",
  FLUIDE: "Fluide",
  DEMI: "Demi",
  ASEXUEL: "Asexuel",
  AUTRE: "Autre",
};

const INTENT_LABELS: Record<string, string> = {
  AMOUR: "Amour",
  AMIS: "Amis",
  FUN: "Fun",
  PLAN_CUL: "Plan cul",
  SPORT: "Sport",
  EVENEMENTS: "Événements",
  DISCUSSION: "Discussion",
  AUTRE: "Autre",
};

type IntentFilterDef = { key: string; label: string; value: string | null };

const INTENT_FILTERS: IntentFilterDef[] = [
  { key: "all", label: "Tous", value: null },
  { key: "AMOUR", label: "Amour", value: "AMOUR" },
  { key: "AMIS", label: "Amis", value: "AMIS" },
  { key: "FUN", label: "Fun", value: "FUN" },
  { key: "PLAN_CUL", label: "Plan cul", value: "PLAN_CUL" },
  { key: "SPORT", label: "Sport", value: "SPORT" },
  { key: "EVENEMENTS", label: "Événements", value: "EVENEMENTS" },
];

interface MatchCandidate {
  profile: any;
  score: number;
  reasons: string[];
  matchedIntents: string[];
}

interface FeedResponse {
  profiles?: MatchCandidate[];
  total?: number;
  filter?: { intent?: string | null; userOrientation?: string | null };
  error?: string;
}

/** Distance Haversine (km) entre l'utilisateur et un candidat. */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Pourcentage de compatibilité borné 0–100 (le score brut peut dépasser 100). */
function scorePct(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [feed, setFeed] = useState<MatchCandidate[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [activeIntent, setActiveIntent] = useState<string | null>(null); // null = Tous
  const [reload, setReload] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");

  /* ── Auth + profil utilisateur (au mount) ── */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile/me")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/auth/login?redirect=/dashboard");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data && !data.error) setProfile(data);
        setAuthChecked(true);
      })
      .catch(() => {
        if (!cancelled) router.push("/auth/login?redirect=/dashboard");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  /* ── Feed : fetch au mount + au changement de filtre intent (+ retry) ── */
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;
    setFeedLoading(true);
    setError("");

    const params = new URLSearchParams({ limit: "20" });
    if (activeIntent) params.set("intent", activeIntent);

    fetch(`/api/match/feed?${params.toString()}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/auth/login?redirect=/dashboard");
          return null;
        }
        return res.json();
      })
      .then((data: FeedResponse | null) => {
        if (cancelled || !data) return;
        if (data.error) {
          setError(data.error);
          setFeed([]);
        } else {
          setFeed(data.profiles ?? []);
        }
        setFeedLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Impossible de charger le feed.");
        setFeedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authChecked, activeIntent, reload, router]);

  /* ── Like / Pass via /api/match/action ── */
  function handleAction(candidate: MatchCandidate, action: "like" | "pass") {
    const targetUserId = candidate.profile?.userId;
    if (!targetUserId) return;
    const id = candidate.profile?.id;
    setPendingId(id ?? null);

    fetch("/api/match/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, action }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (action === "like" && data?.matched) {
          setToast(`Match avec ${displayName(candidate)} ! 💞`);
          setTimeout(() => setToast(""), 3500);
        }
        setFeed((prev) => prev.filter((c) => c.profile?.id !== id));
      })
      .catch(() => {
        /* silencieux : on garde le profil dans le feed */
      })
      .finally(() => setPendingId(null));
  }

  /* ── Helpers d'affichage ── */
  function displayName(c: MatchCandidate): string {
    return c.profile?.displayName || c.profile?.username || "Anonyme";
  }

  function distanceTo(c: MatchCandidate): string | null {
    const u = profile;
    const p = c.profile;
    if (
      u?.latitude != null &&
      u?.longitude != null &&
      p?.latitude != null &&
      p?.longitude != null
    ) {
      const km = haversineKm(u.latitude, u.longitude, p.latitude, p.longitude);
      if (km < 1) return "à moins d'1 km";
      return `à ${Math.round(km)} km`;
    }
    return null;
  }

  /* ── Loading plein écran (vérification auth) ── */
  if (!authChecked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)",
        }}
      >
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-[#ff5e36]/20 border-t-[#ff5e36]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
          Chargement…
        </span>
      </div>
    );
  }

  const greetingName = profile?.displayName || profile?.username || "toi";

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #0f0718 0%, #080212 50%, #04000a 100%)",
      }}
    >
      {/* Ambiance — orbes doux, palette de la landing */}
      <div
        className="absolute pointer-events-none rounded-full opacity-[0.08]"
        style={{
          width: 700,
          height: 700,
          top: "-12%",
          right: "-8%",
          background:
            "radial-gradient(circle, rgba(255,94,54,0.5) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full opacity-[0.06]"
        style={{
          width: 560,
          height: 560,
          bottom: "5%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 60%)",
          filter: "blur(110px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* ───────────── En-tête : bienvenue + CTA profil ───────────── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] bg-[#ff5e36]/10 text-[#ffa333] border border-[#ff5e36]/20">
              <span className="w-1.5 h-1.5 bg-[#ff5e36] rounded-full animate-pulse shadow-[0_0_12px_rgba(255,94,54,0.8)]" />
              100% gratuit · lancement
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] text-white">
              Salut,{" "}
              <span className="bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#d4a574] bg-clip-text text-transparent">
                {greetingName}
              </span>
            </h1>
            <p className="text-white/30 text-sm mt-2 max-w-xl leading-relaxed">
              Voici les profils compatibles avec ton orientation et tes intentions.
              Filtre, découvre, like.
            </p>
          </div>

          <Link
            href="/dashboard/profile"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-[#d4a574] text-[#0a0614] hover:bg-[#e0b88a] transition-all duration-300 shadow-[0_0_30px_rgba(212,165,116,0.25)]"
          >
            <span>Voir mon profil</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        {/* ───────────── Barre de filtres par intention ───────────── */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20 mr-1 hidden sm:inline">
            Je cherche
          </span>
          {INTENT_FILTERS.map((f) => {
            const active = activeIntent === f.value;
            return (
              <button
                key={f.key}
                onClick={() => setActiveIntent(f.value)}
                className={[
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
                  active
                    ? "bg-[#d4a574] text-[#0a0614] border-[#d4a574] shadow-[0_0_20px_rgba(212,165,116,0.3)]"
                    : "border-white/[0.08] text-white/55 hover:text-white hover:border-[#d4a574]/25 hover:bg-white/[0.03]",
                ].join(" ")}
              >
                {f.label}
              </button>
            );
          })}

          {!feedLoading && !error && feed.length > 0 && (
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
              {feed.length} profil{feed.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ───────────── État : erreur ───────────── */}
        {error && !feedLoading && (
          <div className="rounded-2xl border border-[#ff1f5a]/20 bg-[#ff1f5a]/5 p-8 text-center mb-8">
            <p className="text-sm text-white/70 mb-1">Oups — {error}</p>
            {/profil/i.test(error) ? (
              <Link
                href="/dashboard/profile"
                className="text-xs font-semibold text-[#d4a574] hover:text-[#e0b88a]"
              >
                Compléter mon profil →
              </Link>
            ) : (
              <button
                onClick={() => setReload((n) => n + 1)}
                className="text-xs font-semibold text-[#ff5e36] hover:text-[#ffa333]"
              >
                Réessayer
              </button>
            )}
          </div>
        )}

        {/* ───────────── Feed : skeletons au chargement ───────────── */}
        {feedLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 animate-pulse"
              >
                <div className="h-40 rounded-2xl bg-white/[0.04] mb-4" />
                <div className="h-3 w-2/3 rounded bg-white/[0.05] mb-2" />
                <div className="h-3 w-1/3 rounded bg-white/[0.04] mb-4" />
                <div className="h-1.5 w-full rounded-full bg-white/[0.05]" />
              </div>
            ))}
          </div>
        )}

        {/* ───────────── Feed : profils compatibles ───────────── */}
        {!feedLoading && !error && feed.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {feed.map((candidate) => {
              const p = candidate.profile;
              const name = displayName(candidate);
              const initial = (name.charAt(0) || "?").toUpperCase();
              const dist = distanceTo(candidate);
              const pct = scorePct(candidate.score);
              const orientation = p?.orientation
                ? ORIENTATION_LABELS[p.orientation] ?? p.orientation
                : null;
              const intents: string[] = Array.isArray(p?.intentions)
                ? p.intentions
                : [];
              const isPending = pendingId === p?.id;

              return (
                <motion.div
                  key={p?.id ?? name}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: "easeOut" },
                    },
                  }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-[#d4a574]/25"
                >
                  {/* Photo / placeholder gradient */}
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-[#d4a574]/20 to-[#ff5e36]/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-5xl text-white/70 select-none">
                        {initial}
                      </span>
                    </div>

                    {/* Badge orientation (gold) */}
                    {orientation && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#d4a574]/10 text-[#d4a574] text-[10px] font-semibold px-2 py-1 border border-[#d4a574]/15">
                        {orientation}
                      </span>
                    )}

                    {/* Badge vérifié (vert) */}
                    {p?.isVerified && (
                      <span className="absolute top-3 right-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Identité */}
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-serif text-lg text-white truncate">
                      {name}
                    </h3>
                    {p?.age ? (
                      <span className="text-sm text-white/40">{p.age}</span>
                    ) : null}
                  </div>

                  {/* Ville + distance */}
                  <p className="text-xs text-white/35 mb-3 truncate">
                    {p?.city ? p.city : "Ville non renseignée"}
                    {dist ? <span className="text-white/25"> · {dist}</span> : null}
                  </p>

                  {/* Badges intents (ember) */}
                  {intents.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {intents.slice(0, 4).map((it) => (
                        <span
                          key={it}
                          className="rounded-full bg-[#ff5e36]/10 text-[#ff5e36] text-[10px] font-semibold px-2 py-1"
                        >
                          {INTENT_LABELS[it] ?? it}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Score de compatibilité */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                        Compatibilité
                      </span>
                      <span className="text-[10px] font-bold text-[#d4a574]">
                        {pct}% · {pct >= 80 ? "excellente" : pct >= 60 ? "élevée" : pct >= 40 ? "moyenne" : "faible"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#d4a574]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Raisons du match */}
                  {candidate.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {candidate.reasons.slice(0, 4).map((r, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-white/[0.06] bg-white/[0.02] text-white/40 text-[10px] px-2 py-1"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(candidate, "like")}
                      disabled={isPending}
                      aria-label="Liker ce profil"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold bg-[#ff1f5a]/10 text-[#ff1f5a] border border-[#ff1f5a]/20 hover:bg-[#ff1f5a]/20 transition-all duration-300 disabled:opacity-40"
                    >
                      <span>♥</span> Like
                    </button>

                    <Link
                      href={`/u/${p?.username ?? ""}`}
                      className="flex-1 inline-flex items-center justify-center rounded-xl py-2.5 text-xs font-semibold border border-white/[0.08] text-white/60 hover:text-white hover:border-[#d4a574]/25 transition-all duration-300"
                    >
                      Voir profil
                    </Link>

                    <button
                      onClick={() => handleAction(candidate, "pass")}
                      disabled={isPending}
                      aria-label="Passer ce profil"
                      className="inline-flex items-center justify-center rounded-xl py-2.5 px-3 text-xs font-semibold border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-all duration-300 disabled:opacity-40"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ───────────── État vide ───────────── */}
        {!feedLoading && !error && feed.length === 0 && (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-10 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#d4a574]/15 to-[#ff5e36]/10 flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div>
            <h3 className="font-serif text-xl text-white mb-2">
              Aucun profil pour l'instant
            </h3>
            <p className="text-sm text-white/35 max-w-md mx-auto mb-6">
              Embir vient de démarrer. Invite quelques amis pour faire grandir la
              communauté et débloquer de nouvelles rencontres compatibles.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText("https://embir.xyz")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-[#d4a574] text-[#0a0614] hover:bg-[#e0b88a] transition-all duration-300 shadow-[0_0_30px_rgba(212,165,116,0.25)]"
            >
              Inviter des amis · copier le lien
            </button>
          </div>
        )}

        {/* Pied de page éditorial */}
        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-white/10">
          Embir · rencontre multi-orientation · 100% gratuit
        </p>
      </div>

      {/* ───────────── Toast match ───────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-[#d4a574]/30 bg-[#0a0614]/90 backdrop-blur-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(212,165,116,0.2)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
