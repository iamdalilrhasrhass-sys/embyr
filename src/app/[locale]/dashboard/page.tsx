"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ActiveConnections } from "@/components/connection-os/ActiveConnections";
import { ConnectionDashboardErrorBoundary } from "@/components/connection-os/ConnectionDashboardErrorBoundary";
import { dashboardCopy } from "@/components/connection-os/copy";
import {
  SignalPanel,
  type SignalDraft,
} from "@/components/connection-os/SignalPanel";
import { SparkCard } from "@/components/connection-os/SparkCard";
import type {
  ActiveConnection,
  ContextualAction,
  DensityInfo,
  PresenceSignal,
  SparkCandidate,
} from "@/components/connection-os/types";
import {
  candidateKey,
  candidateUserId,
  localePath,
  supportedLocale,
} from "@/components/connection-os/types";
import { trackAnalyticsEvent } from "@/lib/analytics";

type PageStatus = "loading" | "ready" | "redirecting" | "error";

interface ProfileData {
  id: string;
  userId: string;
  username: string;
  displayName?: string | null;
  genderIdentity?: string | null;
  orientation?: string | null;
  seekingGenders?: string[];
  primaryIntent?: string | null;
  acceptedIntents?: string[];
  onboardingCompletedAt?: string | null;
  moderationState?: string;
}

interface AuthData {
  authenticated?: boolean;
  user?: {
    id?: string;
    bannedAt?: string | null;
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function extractSignal(payload: unknown): PresenceSignal | null {
  if (Array.isArray(payload))
    return (payload[0] as PresenceSignal | undefined) ?? null;
  const data = asRecord(payload);
  if (!data) return null;
  if (data.signal) return data.signal as PresenceSignal;
  if (data.activeSignal) return data.activeSignal as PresenceSignal;
  if (Array.isArray(data.signals))
    return (data.signals[0] as PresenceSignal | undefined) ?? null;
  return typeof data.intent === "string"
    ? (data as unknown as PresenceSignal)
    : null;
}

function extractConnections(payload: unknown): ActiveConnection[] {
  let raw: ActiveConnection[] = [];
  if (Array.isArray(payload)) raw = payload as ActiveConnection[];
  const data = asRecord(payload);
  if (data && Array.isArray(data.connections))
    raw = data.connections as ActiveConnection[];
  if (data && Array.isArray(data.matches))
    raw = data.matches as ActiveConnection[];
  return raw.map((connection, index) => ({
    ...connection,
    id:
      connection.id ??
      connection.matchId ??
      connection.conversationId ??
      `connection-${index}`,
    updatedAt: connection.updatedAt ?? connection.matchedAt,
  }));
}

function profileIsReady(profile: ProfileData): boolean {
  return Boolean(
    profile.genderIdentity &&
      profile.orientation &&
      profile.primaryIntent &&
      Array.isArray(profile.seekingGenders) &&
      profile.seekingGenders.length > 0,
  );
}

function DashboardExperience() {
  const router = useRouter();
  const locale = supportedLocale(useLocale());
  const copy = dashboardCopy[locale];
  const [status, setStatus] = useState<PageStatus>("loading");
  const [statusMessage, setStatusMessage] = useState(copy.loading);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [signal, setSignal] = useState<PresenceSignal | null>(null);
  const [signalLoading, setSignalLoading] = useState(true);
  const [signalSaving, setSignalSaving] = useState(false);
  const [signalError, setSignalError] = useState("");
  const [feed, setFeed] = useState<SparkCandidate[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [density, setDensity] = useState<DensityInfo | null>(null);
  const [connections, setConnections] = useState<ActiveConnection[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [pendingCandidate, setPendingCandidate] = useState<string | null>(null);
  const [feedVersion, setFeedVersion] = useState(0);
  const [toast, setToast] = useState("");
  const dashboardTracked = useRef(false);

  const loadConnections = useCallback(async () => {
    setConnectionsLoading(true);
    try {
      const response = await fetch("/api/match/mutual", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("connections_unavailable");
      setConnections(extractConnections(await response.json()));
    } catch {
      setConnections([]);
    } finally {
      setConnectionsLoading(false);
    }
  }, []);

  const loadSignal = useCallback(async () => {
    setSignalLoading(true);
    setSignalError("");
    try {
      const response = await fetch("/api/signals", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("signal_unavailable");
      const nextSignal = extractSignal(await response.json());
      setSignal(nextSignal);
      if (!nextSignal) {
        setFeed([]);
        setDensity(null);
      }
    } catch {
      setSignal(null);
      setSignalError(
        locale === "fr"
          ? "Impossible de charger ton signal."
          : locale === "es"
            ? "No se pudo cargar tu señal."
            : "Your signal could not be loaded.",
      );
    } finally {
      setSignalLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      try {
        const [authResponse, profileResponse] = await Promise.all([
          fetch("/api/auth/me", { credentials: "include", cache: "no-store" }),
          fetch("/api/profile/me", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (authResponse.status === 401 || profileResponse.status === 401) {
          if (!cancelled) {
            setStatus("redirecting");
            setStatusMessage(copy.authRedirect);
            router.replace(
              `${localePath(locale, "/auth/login")}?redirect=${encodeURIComponent(localePath(locale, "/dashboard"))}`,
            );
          }
          return;
        }
        if (profileResponse.status === 404) {
          if (!cancelled) {
            setStatus("redirecting");
            setStatusMessage(copy.onboardingRedirect);
            router.replace(localePath(locale, "/onboarding"));
          }
          return;
        }
        if (!authResponse.ok || !profileResponse.ok)
          throw new Error("initialization_failed");

        const [authData, profileData] = await Promise.all([
          authResponse.json() as Promise<AuthData>,
          profileResponse.json() as Promise<ProfileData>,
        ]);
        if (cancelled) return;
        if (
          authData.user?.bannedAt ||
          profileData.moderationState === "SUSPENDED"
        ) {
          setStatus("error");
          setStatusMessage(
            locale === "fr"
              ? "Ce compte est suspendu."
              : locale === "es"
                ? "Esta cuenta está suspendida."
                : "This account is suspended.",
          );
          return;
        }
        if (!profileIsReady(profileData)) {
          setStatus("redirecting");
          setStatusMessage(copy.onboardingRedirect);
          router.replace(localePath(locale, "/onboarding"));
          return;
        }

        setMyId(authData.user?.id ?? profileData.userId);
        setProfile(profileData);
        setStatus("ready");
        void Promise.all([loadSignal(), loadConnections()]);
      } catch {
        if (!cancelled) {
          setStatus("error");
          setStatusMessage(copy.loadError);
          trackAnalyticsEvent("dashboard_load_error", {
            errorType: "initialization",
          });
        }
      }
    }
    void initialize();
    return () => {
      cancelled = true;
    };
  }, [
    copy.authRedirect,
    copy.loadError,
    copy.onboardingRedirect,
    loadConnections,
    loadSignal,
    locale,
    router,
  ]);

  useEffect(() => {
    if (status !== "ready" || dashboardTracked.current) return;
    dashboardTracked.current = true;
    trackAnalyticsEvent("dashboard_view");
  }, [status]);

  useEffect(() => {
    if (status !== "ready" || signalLoading) return;
    if (!signal) return;

    const activeSignal = signal;
    const controller = new AbortController();
    async function loadFeed() {
      setFeedLoading(true);
      setFeedError("");
      const params = new URLSearchParams({
        intent: activeSignal.intent,
        limit: "5",
      });
      try {
        const response = await fetch(`/api/match/feed?${params.toString()}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`feed_${response.status}`);
        const payload = (await response.json()) as Record<string, unknown>;
        const candidates = Array.isArray(payload.profiles)
          ? (payload.profiles as SparkCandidate[])
          : Array.isArray(payload.candidates)
            ? (payload.candidates as SparkCandidate[])
            : Array.isArray(payload.selection)
              ? (payload.selection as SparkCandidate[])
              : [];
        setFeed(candidates.slice(0, 5));
        const densityPayload = asRecord(payload.density);
        setDensity(
          densityPayload
            ? (densityPayload as DensityInfo)
            : {
                eligibleCount:
                  typeof payload.eligibleCount === "number"
                    ? payload.eligibleCount
                    : undefined,
                selectionSize: candidates.length,
                isColdStart:
                  payload.isColdStart === true ||
                  (Array.isArray(payload.expansionOptions) &&
                    payload.expansionOptions.length > 0),
              },
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setFeed([]);
        setFeedError(copy.loadError);
        trackAnalyticsEvent("dashboard_load_error", { errorType: "feed" });
      } finally {
        if (!controller.signal.aborted) setFeedLoading(false);
      }
    }
    void loadFeed();
    return () => controller.abort();
  }, [copy.loadError, feedVersion, signal, signalLoading, status]);

  async function saveSignal(draft: SignalDraft) {
    setSignalSaving(true);
    setSignalError("");
    try {
      const response = await fetch("/api/signals", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          (payload as { error?: string }).error || "signal_save_failed",
        );
      const nextSignal = extractSignal(payload);
      if (nextSignal) setSignal(nextSignal);
      else await loadSignal();
      setToast(copy.signalSaved);
      trackAnalyticsEvent("signal_created", {
        intent: draft.intent,
        socialEnergy: draft.socialEnergy,
        durationHours: draft.durationHours,
        formatCount: draft.formats.length,
      });
    } catch (error) {
      setSignalError(
        error instanceof Error ? error.message : "signal_save_failed",
      );
    } finally {
      setSignalSaving(false);
    }
  }

  async function deleteSignal() {
    setSignalSaving(true);
    setSignalError("");
    try {
      const response = await fetch("/api/signals", {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("signal_delete_failed");
      setSignal(null);
      setFeed([]);
      setDensity(null);
      setToast(copy.signalRemoved);
    } catch (error) {
      setSignalError(
        error instanceof Error ? error.message : "signal_delete_failed",
      );
    } finally {
      setSignalSaving(false);
    }
  }

  async function actOnCandidate(
    candidate: SparkCandidate,
    action: ContextualAction,
  ) {
    const targetUserId = candidateUserId(candidate);
    if (!targetUserId) return;
    const key = candidateKey(candidate);
    setPendingCandidate(key);
    setFeedError("");
    try {
      const response = await fetch("/api/match/action", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, ...action }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        matched?: boolean;
        reciprocal?: boolean;
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "action_failed");
      setFeed((current) =>
        current.filter((item) => candidateKey(item) !== key),
      );
      if (action.action === "like") {
        trackAnalyticsEvent("dashboard_like");
      } else {
        trackAnalyticsEvent("dashboard_pass");
      }
      if (payload.matched || payload.reciprocal) {
        setToast(copy.match);
        trackAnalyticsEvent("dashboard_match");
        await loadConnections();
      }
    } catch {
      setFeedError(copy.actionError);
    } finally {
      setPendingCandidate(null);
    }
  }

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText("https://embir.xyz/invite");
      setToast(copy.inviteCopied);
    } catch {
      window.location.assign(localePath(locale, "/invite"));
    }
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (status !== "ready") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#06020c] px-6 text-center text-white">
        <div>
          {status !== "error" ? (
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              className="mx-auto h-9 w-9 rounded-full border-2 border-[#ff5e36]/20 border-t-[#ff5e36]"
            />
          ) : (
            <span aria-hidden="true" className="text-3xl">
              ◇
            </span>
          )}
          <p className="mt-4 text-sm text-white/45">{statusMessage}</p>
          {status === "error" ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#d4a574] px-6 py-3 text-sm font-bold text-[#0a0614]"
            >
              {copy.retry}
            </button>
          ) : null}
        </div>
      </main>
    );
  }

  const greeting = profile?.displayName || profile?.username;
  const lowDensity =
    density?.isColdStart ||
    density?.eligibleCount === 0 ||
    density?.localCount === 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06020c] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#ff5e36]/[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-48 h-[32rem] w-[32rem] rounded-full bg-[#d4a574]/[0.06] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-col gap-5 border-b border-white/[0.06] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff8a5c]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
              {copy.subtitle}
            </p>
            {greeting ? (
              <p className="mt-3 text-xs text-white/25">
                {locale === "fr"
                  ? `Pour ${greeting}`
                  : locale === "es"
                    ? `Para ${greeting}`
                    : `For ${greeting}`}
              </p>
            ) : null}
          </div>
          <Link
            href={localePath(locale, "/dashboard/profile")}
            onClick={() => trackAnalyticsEvent("dashboard_to_profile")}
            className="inline-flex self-start rounded-xl border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-5 py-3 text-xs font-semibold text-[#e6c29c] transition hover:bg-[#d4a574]/10 sm:self-auto"
          >
            {copy.profile}
          </Link>
        </header>

        <div className="my-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] px-4 py-3 text-center text-xs font-medium text-emerald-100/70">
          {copy.free}
        </div>

        <nav
          aria-label="Connection OS"
          className="mb-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          {copy.steps.map((step, index) => (
            <a
              key={step}
              href={`#connection-step-${index + 1}`}
              className="border-r border-white/[0.06] px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 transition last:border-r-0 hover:bg-white/[0.025] hover:text-white sm:text-xs"
            >
              <span className="mr-1 text-[#d4a574]">0{index + 1}</span> {step}
            </a>
          ))}
        </nav>

        <div id="connection-step-1">
          {signalLoading ? (
            <div className="h-64 animate-pulse rounded-[2rem] border border-white/[0.05] bg-white/[0.02]" />
          ) : (
            <SignalPanel
              key={signal?.id ?? "new-signal"}
              locale={locale}
              signal={signal}
              saving={signalSaving}
              error={signalError}
              onSave={saveSignal}
              onDelete={deleteSignal}
            />
          )}
        </div>

        <section
          id="connection-step-2"
          aria-labelledby="sparks-title"
          className="mt-8 rounded-[2rem] border border-white/[0.07] bg-white/[0.018] p-5 sm:p-7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ff7895]">
                02 · {copy.steps[1]}
              </p>
              <h2
                id="sparks-title"
                className="font-serif text-2xl text-white sm:text-3xl"
              >
                {copy.sparkTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                {copy.sparkIntro}
              </p>
            </div>
            {!feedLoading && signal && feed.length > 0 ? (
              <p className="text-xs text-white/30">
                {copy.sparkCount(feed.length)}
              </p>
            ) : null}
          </div>

          {feedError ? (
            <div
              role="alert"
              className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#ff1f5a]/20 bg-[#ff1f5a]/[0.06] px-4 py-3 text-sm text-[#ff9ab0]"
            >
              <span>{feedError}</span>
              <button
                type="button"
                onClick={() => setFeedVersion((value) => value + 1)}
                className="shrink-0 text-xs font-bold"
              >
                {copy.retry}
              </button>
            </div>
          ) : null}

          {!signal && !signalLoading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#ff5e36]/20 bg-[#ff5e36]/[0.025] p-8 text-center">
              <span aria-hidden="true" className="text-3xl text-[#ff8a5c]">
                ✦
              </span>
              <h3 className="mt-3 font-serif text-xl">{copy.noSignalTitle}</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-white/40">
                {copy.noSignalBody}
              </p>
            </div>
          ) : feedLoading ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-[1.75rem] border border-white/[0.05] bg-white/[0.02]"
                />
              ))}
            </div>
          ) : signal && feed.length > 0 ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {feed.map((candidate) => (
                <SparkCard
                  key={candidateKey(candidate)}
                  locale={locale}
                  candidate={candidate}
                  pending={pendingCandidate === candidateKey(candidate)}
                  onAction={actOnCandidate}
                />
              ))}
            </div>
          ) : signal ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/[0.09] p-8 text-center">
              <span aria-hidden="true" className="text-3xl text-[#d4a574]">
                ◇
              </span>
              <h3 className="mt-3 font-serif text-xl">
                {copy.sparkEmptyTitle}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/40">
                {copy.sparkEmptyBody}
              </p>
              {lowDensity ? (
                <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-[#d4a574]/65">
                  {copy.densityLow}
                </p>
              ) : null}
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={localePath(locale, "/dashboard/profile")}
                  className="rounded-xl border border-white/[0.09] px-5 py-3 text-xs font-semibold text-white/55 transition hover:text-white"
                >
                  {copy.editPreferences}
                </Link>
                <button
                  type="button"
                  onClick={() => void copyInviteLink()}
                  className="rounded-xl bg-[#d4a574] px-5 py-3 text-xs font-bold text-[#0a0614]"
                >
                  {copy.invite}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <div id="connection-step-3" className="mt-8">
          <ActiveConnections
            locale={locale}
            connections={connections}
            myId={myId}
            loading={connectionsLoading}
          />
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[#d4a574]/25 bg-[#0a0614]/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ConnectionDashboardErrorBoundary>
      <DashboardExperience />
    </ConnectionDashboardErrorBoundary>
  );
}
