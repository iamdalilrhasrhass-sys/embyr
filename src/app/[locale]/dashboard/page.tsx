"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────────────────────────────────────────────────────────────
 * Embir — Dashboard multi-orientation & multi-intention
 *
 * Affiche un feed de profils compatibles (via /api/match/feed) filtrable par
 * intention. Gère TOUS les états utilisateur :
 *
 *   not_authenticated → /auth/login
 *   no_profile        → /onboarding
 *   verification_pending → dashboard limité + bandeau
 *   verified          → dashboard complet
 *   banned            → page "compte bloqué"
 *   error             → page d'erreur propre
 *
 * NE JAMAIS afficher "This page couldn't load" — tout crash est capturé.
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

type UserStatus =
  | "loading"
  | "not_authenticated"
  | "no_profile"
  | "onboarding_incomplete"
  | "verification_pending"
  | "verified"
  | "banned"
  | "error";

interface ProfileData {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  age: number;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  genderIdentity: string | null;
  isVerified: boolean;
  isPremium: boolean;
  intentions: string[];
  description: string | null;
  canReceiveMessages: boolean;
  [key: string]: unknown;
}

/** Distance Haversine (km) */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Pourcentage de compatibilité borné 0–100 */
function scorePct(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/* ───────────── Error Boundary ───────────── */
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset?: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onReset?: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[Dashboard ErrorBoundary]", error, info.componentStack);
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{
          background: "radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)",
        }}>
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#ff1f5a]/10 flex items-center justify-center">
              <span className="text-2xl">⚠</span>
            </div>
            <h2 className="font-serif text-2xl text-white mb-3">Une erreur est survenue</h2>
            <p className="text-sm text-white/40 mb-6 font-mono">
              {this.state.error?.message || "Erreur inconnue"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#d4a574] text-[#0a0614] hover:bg-[#e0b88a] transition-all"
              >
                Réessayer
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl text-xs font-semibold border border-white/[0.08] text-white/60 hover:text-white transition-all"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ───────────── Composant Dashboard ───────────── */
function DashboardInner() {
  const router = useRouter();

  const [status, setStatus] = useState<UserStatus>("loading");
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [feed, setFeed] = useState<Record<string, unknown>[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  /* ── Analytics (fire-and-forget, once per mount) ── */
  const firedRef = useRef(new Set<string>());

  function track(ev: string, props?: Record<string, unknown>) {
    if (firedRef.current.has(ev)) return;
    firedRef.current.add(ev);
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: ev,
        page: window.location.pathname,
        properties: props || {},
        timestamp: Date.now(),
        language: document.documentElement.lang,
        referrer: document.referrer,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  /* ── Étape 1 : Auth + status ── */
  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        // D'abord vérifier l'auth
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();
        if (!authData.authenticated) {
          if (!cancelled) {
            setStatus("not_authenticated");
            router.push("/auth/login?redirect=/dashboard");
          }
          return;
        }

        // Ensuite charger le profil
        const profileRes = await fetch("/api/profile/me");

        if (profileRes.status === 404) {
          if (!cancelled) {
            setStatus("no_profile");
            router.push("/onboarding");
          }
          return;
        }

        if (!profileRes.ok) {
          if (!cancelled) setStatus("error");
          return;
        }

        const profileData: ProfileData = await profileRes.json();
        if (cancelled) return;

        setProfile(profileData);

        // Déterminer le statut
        if (!profileData.isVerified) {
          // Vérifier si une demande de vérification a été faite (GET)
          try {
            const verifRes = await fetch("/api/verification/request");
            if (verifRes.ok) {
              const verifData = await verifRes.json();
              if (verifData?.status === "pending") {
                if (!cancelled) { setStatus("verification_pending"); setFeedLoading(false); }
                return;
              }
              if (verifData?.status === "rejected") {
                // Profil rejeté : on laisse l'utilisateur voir le dashboard mais avec un message
                // Pas de blocage, juste pas de feed
                if (!cancelled) { setStatus("verified"); }
              }
            }
          } catch {
            // GET peut échouer si pas de demande existante
          }

          // Vérifier si le profil est incomplet
          if (!profileData.city || !profileData.description || !profileData.genderIdentity) {
            if (!cancelled) { setStatus("onboarding_incomplete"); setFeedLoading(false); }
            return;
          }
        }

        if (!cancelled) setStatus("verified");
      } catch (err) {
        if (!cancelled) {
          console.error("[Dashboard] Auth check error:", err);
          setStatus("error");
        }
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, [router]);

  /* ── Feed : fetch au mount + filtre + retry ── */
  useEffect(() => {
    if (status !== "verified") return;
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
      .then((data: Record<string, unknown> | null) => {
        if (cancelled || !data) return;
        if (data.error) {
          setError(String(data.error));
          setFeed([]);
          track('dashboard_load_error', { errorType: String(data.error) });
        } else {
          const profiles = Array.isArray(data.profiles) ? data.profiles : [];
          setFeed(profiles);
        }
        setFeedLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Impossible de charger le feed.");
        setFeedLoading(false);
        track('dashboard_load_error', { errorType: 'network' });
      });

    return () => { cancelled = true; };
  }, [status, activeIntent, reload, router]);

  /* ── Analytics: dashboard_view (fire once when feed is loaded) ── */
  useEffect(() => {
    if (status === "verified" && !feedLoading && !error) {
      track('dashboard_view');
    }
  }, [status, feedLoading, error]);

  /* ── Like / Pass ── */
  function handleAction(candidate: Record<string, unknown>, action: "like" | "pass") {
    const targetUserId = (candidate?.userId as string) || (candidate?.profile as Record<string, unknown>)?.["userId"] as string;
    if (!targetUserId) return;
    const id = (candidate?.id as string) || (candidate?.profile as Record<string, unknown>)?.["id"] as string;
    setPendingId(id ?? null);

    // Analytics
    if (action === "like") track('dashboard_like');
    else track('dashboard_pass');

    fetch("/api/match/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, action }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (action === "like" && data?.matched) {
          setToast(`Match ! 💞`);
          track('dashboard_match');
          setTimeout(() => setToast(""), 3500);
        }
        setFeed((prev) => prev.filter((c) => (c.id || (c.profile as Record<string, unknown>)?.["id"]) !== id));
      })
      .catch(() => {})
      .finally(() => setPendingId(null));
  }

  /* ── Helpers d'affichage (flat-safe) ── */
  function displayName(c: Record<string, unknown>): string {
    // Support both flat (API v1) and nested (interface) structures
    const p = (c.profile as Record<string, unknown>) || c;
    return (p?.displayName as string) || (p?.username as string) || "Anonyme";
  }

  function distanceStr(c: Record<string, unknown>, user: ProfileData | null): string | null {
    const p = (c.profile as Record<string, unknown>) || c;
    if (
      user?.latitude != null && user?.longitude != null &&
      p?.latitude != null && p?.longitude != null
    ) {
      const km = haversineKm(user.latitude, user.longitude, Number(p.latitude), Number(p.longitude));
      if (km < 1) return "à moins d'1 km";
      return `à ${Math.round(km)} km`;
    }
    return null;
  }

  /* ── Status-specific renders ── */

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)",
      }}>
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-[#ff5e36]/20 border-t-[#ff5e36]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
      </div>
    );
  }

  if (status === "banned") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)",
      }}>
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#ff1f5a]/10 flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="font-serif text-2xl text-white mb-3">Compte suspendu</h2>
          <p className="text-sm text-white/40 mb-6">
            Ton compte a été suspendu. Contacte le support pour plus d'informations.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 rounded-xl text-xs font-semibold border border-white/[0.08] text-white/60 hover:text-white transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)",
      }}>
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#ff1f5a]/10 flex items-center justify-center">
            <span className="text-2xl">⚠</span>
          </div>
          <h2 className="font-serif text-2xl text-white mb-3">Erreur de chargement</h2>
          <p className="text-sm text-white/40 mb-6">
            Impossible de charger le tableau de bord. Réessaie ou reconnecte-toi.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#d4a574] text-[#0a0614] hover:bg-[#e0b88a] transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (status === "no_profile" || status === "onboarding_incomplete") {
    // These redirect to /onboarding, but show a fallback in case of delay
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8" style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d0714 0%, #06020c 60%, #020005 100%)",
      }}>
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-[#ff5e36]/20 border-t-[#ff5e36]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
        <p className="text-sm text-white/40">Redirection vers l'onboarding...</p>
      </div>
    );
  }

  if (status === "verification_pending") {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{
        background: "radial-gradient(ellipse at 50% 15%, #0f0718 0%, #080212 50%, #04000a 100%)",
      }}>
        <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-6 py-20 text-center">
          <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-[#d4a574]/20 to-[#ff5e36]/10 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl"
            >
              ⏳
            </motion.div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Vérification en cours
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Nous vérifions ta photo. C'est généralement rapide — tu recevras une
            notification sous 24h maximum. En attendant, tu peux compléter ton profil.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/profile"
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-[#d4a574] text-[#0a0614] hover:bg-[#e0b88a] transition-all"
            >
              Compléter mon profil
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl text-xs font-semibold border border-white/[0.08] text-white/60 hover:text-white transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>

          <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-3">
              Pourquoi la vérification ?
            </h3>
            <p className="text-xs text-white/30 leading-relaxed">
              Embir est une plateforme 100% gratuite sans pub. La vérification photo
              garantit que chaque membre est une vraie personne. Pas de bots, pas de faux profils.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── STATUS: verified → Dashboard complet ── */
  const greetingName = profile?.displayName || profile?.username || "toi";

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: "radial-gradient(ellipse at 50% 15%, #0f0718 0%, #080212 50%, #04000a 100%)",
    }}>
      {/* Ambiance orbes */}
      <div className="absolute pointer-events-none rounded-full opacity-[0.08]"
        style={{ width: 700, height: 700, top: "-12%", right: "-8%",
          background: "radial-gradient(circle, rgba(255,94,54,0.5) 0%, transparent 60%)",
          filter: "blur(120px)" }}
      />
      <div className="absolute pointer-events-none rounded-full opacity-[0.06]"
        style={{ width: 560, height: 560, bottom: "5%", left: "-8%",
          background: "radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 60%)",
          filter: "blur(110px)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* En-tête */}
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
            onClick={() => track('dashboard_to_profile')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-[#d4a574] text-[#0a0614] hover:bg-[#e0b88a] transition-all duration-300 shadow-[0_0_30px_rgba(212,165,116,0.25)]"
          >
            <span>Voir mon profil</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Barre de filtres */}
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

        {/* Erreur */}
        {error && !feedLoading && (
          <div className="rounded-2xl border border-[#ff1f5a]/20 bg-[#ff1f5a]/5 p-8 text-center mb-8">
            <p className="text-sm text-white/70 mb-1">Oups — {error}</p>
            <button
              onClick={() => setReload((n) => n + 1)}
              className="text-xs font-semibold text-[#ff5e36] hover:text-[#ffa333]"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Loading */}
        {feedLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 animate-pulse">
                <div className="h-40 rounded-2xl bg-white/[0.04] mb-4" />
                <div className="h-3 w-2/3 rounded bg-white/[0.05] mb-2" />
                <div className="h-3 w-1/3 rounded bg-white/[0.04] mb-4" />
                <div className="h-1.5 w-full rounded-full bg-white/[0.05]" />
              </div>
            ))}
          </div>
        )}

        {/* Feed : profils compatibles */}
        {!feedLoading && !error && feed.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          >
            {feed.map((candidate) => {
              // Support flat API (profile fields at top level) and legacy nested format
              const p = (candidate.profile as Record<string, unknown>) || candidate;
              const name = displayName(candidate);
              const initial = (name.charAt(0) || "?").toUpperCase();
              const dist = distanceStr(candidate, profile);
              const pct = scorePct(candidate.score as number || 0);
              const orientation = p?.orientation
                ? ORIENTATION_LABELS[p.orientation as string] ?? (p.orientation as string)
                : (p?.genderIdentity
                  ? ORIENTATION_LABELS[p.genderIdentity as string] ?? (p.genderIdentity as string)
                  : null);
              const intents: string[] = Array.isArray(p?.intentions)
                ? p.intentions as string[]
                : [];
              const id = (candidate.id as string) || (p.id as string) || name;
              const isPending = pendingId === id;
              const reasons: string[] = Array.isArray(candidate.reasons)
                ? candidate.reasons as string[]
                : [];

              return (
                <motion.div
                  key={id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                  }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-[#d4a574]/25"
                >
                  {/* Photo / placeholder */}
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-[#d4a574]/20 to-[#ff5e36]/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-5xl text-white/70 select-none">{initial}</span>
                    </div>
                    {orientation && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#d4a574]/10 text-[#d4a574] text-[10px] font-semibold px-2 py-1 border border-[#d4a574]/15">
                        {orientation}
                      </span>
                    )}
                    {Boolean(p?.isVerified) && (
                      <span className="absolute top-3 right-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs">✓</span>
                    )}
                  </div>

                  {/* Identité */}
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-serif text-lg text-white truncate">{name}</h3>
                    {p?.age ? <span className="text-sm text-white/40">{String(p.age)}</span> : null}
                  </div>

                  {/* Ville + distance */}
                  <p className="text-xs text-white/35 mb-3 truncate">
                    {p?.city ? String(p.city) : "Ville non renseignée"}
                    {dist ? <span className="text-white/25"> · {dist}</span> : null}
                  </p>

                  {/* Badges intents */}
                  {intents.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {intents.slice(0, 4).map((it) => (
                        <span key={it} className="rounded-full bg-[#ff5e36]/10 text-[#ff5e36] text-[10px] font-semibold px-2 py-1">
                          {INTENT_LABELS[it] ?? it}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Score de compatibilité */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">Compatibilité</span>
                      <span className="text-[10px] font-bold text-[#d4a574]">
                        {pct}% · {pct >= 80 ? "excellente" : pct >= 60 ? "élevée" : pct >= 40 ? "moyenne" : "faible"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#d4a574]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Raisons du match (safe: optional chaining) */}
                  {reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {reasons.slice(0, 4).map((r, i) => (
                        <span key={i} className="rounded-md border border-white/[0.06] bg-white/[0.02] text-white/40 text-[10px] px-2 py-1">{r}</span>
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
                      href={`/u/${p?.username ? String(p.username) : ""}`}
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

        {/* Empty state */}
        {!feedLoading && !error && feed.length === 0 && (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-10 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#d4a574]/15 to-[#ff5e36]/10 flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Aucun profil pour l'instant</h3>
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

        {/* Footer */}
        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-white/10">
          Embir · rencontre multi-orientation · 100% gratuit
        </p>
      </div>

      {/* Toast match */}
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

/* ───────────── Export avec Error Boundary ───────────── */
export default function DashboardPage() {
  const [, setResetKey] = useState(0);
  return (
    <DashboardErrorBoundary onReset={() => setResetKey((k) => k + 1)}>
      <DashboardInner />
    </DashboardErrorBoundary>
  );
}
