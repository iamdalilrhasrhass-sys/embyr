"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type {
  SignalFormat,
  SupportedLocale,
} from "@/components/connection-os/types";
import { localePath } from "@/components/connection-os/types";

type Connection = {
  id: string;
  state: string;
  conversationId: string | null;
  profile: {
    displayName?: string | null;
    username?: string | null;
    city?: string | null;
  } | null;
  myOutcome: { outcome: Outcome; note: string | null } | null;
};

type Reveal = {
  id: string;
  prompt: string;
  responded: boolean;
  bothResponded: boolean;
  completedAt: string | null;
  responses: Array<{ isMine: boolean; content: string; createdAt: string }>;
};

type Plan = {
  id: string;
  proposedAt: string;
  format: SignalFormat;
  publicPlace: string | null;
  approximateArea: string | null;
  status: string;
  acceptedAt: string | null;
  safetySharedAt: string | null;
  canAccept: boolean;
  canReschedule: boolean;
  canCancel: boolean;
};

type Outcome = "CONTINUE" | "FRIENDS" | "PAUSE" | "CLOSE" | "REPORT";
type PlanAction = "accept" | "cancel" | "reschedule" | "mark_safety_shared";

const outcomes: Outcome[] = [
  "CONTINUE",
  "FRIENDS",
  "PAUSE",
  "CLOSE",
  "REPORT",
];

const formats: SignalFormat[] = [
  "CAFE",
  "BALADE",
  "SPORT",
  "SORTIE",
  "ACTIVITE",
  "DISCUSSION",
];

const copy = {
  fr: {
    back: "Retour au tableau de bord",
    eyebrow: "Connexion réciproque",
    loading: "La connexion se prépare…",
    unavailable: "Cette connexion n’est plus disponible.",
    retry: "Réessayer",
    revealStep: "01 · Résonance",
    fallbackPrompt: "Quelle activité aimerais-tu partager bientôt ?",
    conversationReady: "Votre conversation est ouverte",
    answer:
      "Ta réponse reste cachée jusqu’à ce que vous ayez répondu tous les deux.",
    placeholder: "Une réponse sincère, en quelques mots…",
    send: "Sceller ma réponse",
    waiting:
      "Ta réponse est scellée. Embir te préviendra quand l’autre personne aura répondu.",
    revealed: "Vos réponses se dévoilent ensemble",
    resonanceOpen: "Deux réponses. Une ouverture commune.",
    resonanceSealed: "Ta braise est scellée",
    resonanceRevealed: "La résonance est ouverte",
    conversation: "Ouvrir la conversation",
    planStep: "02 · Rencontre",
    planTitle: "Transformer l’échange en moment réel",
    planBody:
      "Propose un créneau et un lieu public. La localisation précise reste facultative.",
    when: "Créneau",
    format: "Format",
    place: "Lieu public ou zone approximative",
    placePlaceholder: "Ex. centre de Zurich, café public…",
    propose: "Proposer ce moment",
    accept: "Accepter",
    cancel: "Annuler la proposition",
    reschedule: "Modifier le créneau",
    newTime: "Nouveau créneau",
    confirmReschedule: "Confirmer le nouveau créneau",
    dismiss: "Garder le créneau actuel",
    safety:
      "J’ai partagé ces informations avec une personne de confiance",
    noPlans: "Aucune proposition pour le moment.",
    afterStep: "03 · Après",
    afterTitle: "Un retour privé, sans note publique",
    afterBody:
      "Ton choix reste privé. Il sert uniquement à faire avancer ou clôturer cette connexion avec respect.",
    outcomeLegend: "Choisis la suite de cette connexion",
    CONTINUE: "Continuer",
    FRIENDS: "Rester amis",
    PAUSE: "Faire une pause",
    CLOSE: "Clôturer",
    REPORT: "Signaler un problème",
    note: "Note privée facultative",
    save: "Enregistrer mon choix",
    saved: "Choix enregistré.",
    error:
      "Une erreur est survenue. Réessaie sans partager d’information sensible.",
    you: "Toi",
  },
  en: {
    back: "Back to dashboard",
    eyebrow: "Reciprocal connection",
    loading: "Preparing the connection…",
    unavailable: "This connection is no longer available.",
    retry: "Try again",
    revealStep: "01 · Resonance",
    fallbackPrompt: "What activity would you like to share soon?",
    conversationReady: "Your conversation is open",
    answer: "Your answer stays hidden until you have both replied.",
    placeholder: "A genuine answer, in a few words…",
    send: "Seal my answer",
    waiting:
      "Your answer is sealed. Embir will notify you when the other person replies.",
    revealed: "Your answers are revealed together",
    resonanceOpen: "Two answers. One shared opening.",
    resonanceSealed: "Your ember is sealed",
    resonanceRevealed: "The resonance is open",
    conversation: "Open conversation",
    planStep: "02 · Meet",
    planTitle: "Turn the exchange into a real moment",
    planBody:
      "Suggest a time and a public place. Precise location remains optional.",
    when: "Time",
    format: "Format",
    place: "Public place or approximate area",
    placePlaceholder: "E.g. central Zurich, a public café…",
    propose: "Suggest this moment",
    accept: "Accept",
    cancel: "Cancel proposal",
    reschedule: "Change time",
    newTime: "New time",
    confirmReschedule: "Confirm new time",
    dismiss: "Keep the current time",
    safety: "I shared these details with someone I trust",
    noPlans: "No proposal yet.",
    afterStep: "03 · After",
    afterTitle: "Private feedback, never a public score",
    afterBody:
      "Your choice stays private. It only helps progress or close this connection respectfully.",
    outcomeLegend: "Choose what happens next",
    CONTINUE: "Keep going",
    FRIENDS: "Stay friends",
    PAUSE: "Take a pause",
    CLOSE: "Close",
    REPORT: "Report a problem",
    note: "Optional private note",
    save: "Save my choice",
    saved: "Choice saved.",
    error:
      "Something went wrong. Try again without sharing sensitive information.",
    you: "You",
  },
  es: {
    back: "Volver al panel",
    eyebrow: "Conexión recíproca",
    loading: "Preparando la conexión…",
    unavailable: "Esta conexión ya no está disponible.",
    retry: "Reintentar",
    revealStep: "01 · Resonancia",
    fallbackPrompt: "¿Qué actividad te gustaría compartir pronto?",
    conversationReady: "Vuestra conversación está abierta",
    answer: "Tu respuesta permanece oculta hasta que ambos hayan respondido.",
    placeholder: "Una respuesta sincera, en pocas palabras…",
    send: "Sellar mi respuesta",
    waiting:
      "Tu respuesta está sellada. Embir te avisará cuando responda la otra persona.",
    revealed: "Vuestras respuestas se revelan juntas",
    resonanceOpen: "Dos respuestas. Una apertura compartida.",
    resonanceSealed: "Tu brasa está sellada",
    resonanceRevealed: "La resonancia está abierta",
    conversation: "Abrir conversación",
    planStep: "02 · Encuentro",
    planTitle: "Convertir el intercambio en un momento real",
    planBody:
      "Propón una hora y un lugar público. La ubicación exacta sigue siendo opcional.",
    when: "Hora",
    format: "Formato",
    place: "Lugar público o zona aproximada",
    placePlaceholder: "Ej. centro de Zúrich, un café público…",
    propose: "Proponer este momento",
    accept: "Aceptar",
    cancel: "Cancelar propuesta",
    reschedule: "Cambiar la hora",
    newTime: "Nueva hora",
    confirmReschedule: "Confirmar la nueva hora",
    dismiss: "Mantener la hora actual",
    safety: "He compartido estos datos con alguien de confianza",
    noPlans: "Todavía no hay propuesta.",
    afterStep: "03 · Después",
    afterTitle: "Opinión privada, nunca una nota pública",
    afterBody:
      "Tu elección sigue siendo privada. Solo ayuda a avanzar o cerrar esta conexión con respeto.",
    outcomeLegend: "Elige cómo continúa esta conexión",
    CONTINUE: "Continuar",
    FRIENDS: "Seguir como amigos",
    PAUSE: "Hacer una pausa",
    CLOSE: "Cerrar",
    REPORT: "Señalar un problema",
    note: "Nota privada opcional",
    save: "Guardar mi elección",
    saved: "Elección guardada.",
    error:
      "Ha ocurrido un error. Reinténtalo sin compartir información sensible.",
    you: "Tú",
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

const connectionStateLabels: Record<
  SupportedLocale,
  Record<string, string>
> = {
  fr: {
    RECIPROCAL: "Réciproque",
    REVEAL_PENDING: "Résonance en cours",
    REVEAL_COMPLETED: "Résonance révélée",
    CONVERSATION: "Conversation ouverte",
    PLAN_PROPOSED: "Proposition en attente",
    PLAN_CONFIRMED: "Rencontre confirmée",
    MET: "Rencontre réalisée",
    CONTINUE: "À poursuivre",
    FRIENDS: "Amitié",
    PAUSED: "En pause",
  },
  en: {
    RECIPROCAL: "Reciprocal",
    REVEAL_PENDING: "Resonance in progress",
    REVEAL_COMPLETED: "Resonance revealed",
    CONVERSATION: "Conversation open",
    PLAN_PROPOSED: "Proposal awaiting reply",
    PLAN_CONFIRMED: "Meetup confirmed",
    MET: "Met",
    CONTINUE: "Keep going",
    FRIENDS: "Friendship",
    PAUSED: "Paused",
  },
  es: {
    RECIPROCAL: "Recíproca",
    REVEAL_PENDING: "Resonancia en curso",
    REVEAL_COMPLETED: "Resonancia revelada",
    CONVERSATION: "Conversación abierta",
    PLAN_PROPOSED: "Propuesta pendiente",
    PLAN_CONFIRMED: "Encuentro confirmado",
    MET: "Encuentro realizado",
    CONTINUE: "Continuar",
    FRIENDS: "Amistad",
    PAUSED: "En pausa",
  },
};

const planStatusLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    PROPOSED: "Proposé",
    RESCHEDULED: "Nouveau créneau",
    CONFIRMED: "Confirmé",
    CANCELLED: "Annulé",
    COMPLETED: "Réalisé",
  },
  en: {
    PROPOSED: "Proposed",
    RESCHEDULED: "Rescheduled",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  },
  es: {
    PROPOSED: "Propuesto",
    RESCHEDULED: "Nueva hora",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    COMPLETED: "Realizado",
  },
};

const formatLabels: Record<SupportedLocale, Record<SignalFormat, string>> = {
  fr: {
    DISCUSSION: "Discussion",
    CAFE: "Café",
    BALADE: "Balade",
    SPORT: "Sport",
    SORTIE: "Sortie",
    ACTIVITE: "Activité",
    AUTRE: "Autre",
  },
  en: {
    DISCUSSION: "Conversation",
    CAFE: "Coffee",
    BALADE: "Walk",
    SPORT: "Sport",
    SORTIE: "Going out",
    ACTIVITE: "Activity",
    AUTRE: "Other",
  },
  es: {
    DISCUSSION: "Conversación",
    CAFE: "Café",
    BALADE: "Paseo",
    SPORT: "Deporte",
    SORTIE: "Salida",
    ACTIVITE: "Actividad",
    AUTRE: "Otro",
  },
};

const localizedRevealPrompts: Record<
  string,
  Record<SupportedLocale, string>
> = {
  "Quel petit moment rendrait ta semaine meilleure ?": {
    fr: "Quel petit moment rendrait ta semaine meilleure ?",
    en: "What small moment would make your week better?",
    es: "¿Qué pequeño momento mejoraría tu semana?",
  },
  "Quelle activité aimerais-tu partager bientôt ?": {
    fr: "Quelle activité aimerais-tu partager bientôt ?",
    en: "What activity would you like to share soon?",
    es: "¿Qué actividad te gustaría compartir pronto?",
  },
  "Qu’est-ce qui te met immédiatement à l’aise avec quelqu’un ?": {
    fr: "Qu’est-ce qui te met immédiatement à l’aise avec quelqu’un ?",
    en: "What immediately makes you feel at ease with someone?",
    es: "¿Qué hace que te sientas a gusto con alguien de inmediato?",
  },
};

async function jsonRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };
  if (!response.ok) throw new Error(payload.error || "request_failed");
  return payload;
}

function toLocalDateTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function defaultDateTime(): string {
  const next = new Date(Date.now() + 24 * 60 * 60 * 1000);
  next.setMinutes(Math.ceil(next.getMinutes() / 15) * 15, 0, 0);
  return toLocalDateTime(next);
}

function localizeRevealPrompt(
  locale: SupportedLocale,
  prompt: string,
): string {
  return localizedRevealPrompts[prompt]?.[locale] ?? prompt;
}

function conversationHref(
  locale: SupportedLocale,
  conversationId: string,
): string {
  return `${localePath(locale, "/messages")}?conversation=${encodeURIComponent(conversationId)}`;
}

function ResonanceSeal({
  status,
  label,
  reduceMotion,
}: {
  status: "open" | "sealed" | "revealed";
  label: string;
  reduceMotion: boolean | null;
}) {
  const active = status === "sealed";
  return (
    <div className="my-7 flex flex-col items-center" role="img" aria-label={label}>
      <div className="relative h-36 w-36" aria-hidden="true">
        <motion.div
          className="absolute inset-2 rounded-full border border-[#d4a574]/35"
          animate={active && !reduceMotion ? { rotate: 360 } : undefined}
          transition={active ? { duration: 16, ease: "linear", repeat: Infinity } : undefined}
        />
        <motion.div
          className="absolute inset-5 rounded-full border border-dashed border-[#ff5e36]/35"
          animate={active && !reduceMotion ? { rotate: -360 } : undefined}
          transition={active ? { duration: 11, ease: "linear", repeat: Infinity } : undefined}
        />
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full border border-[#e4a187]/60 bg-[#12090b] shadow-[0_0_18px_rgba(228,161,135,0.65)]" />
        <span className={`absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#e4a187]/60 shadow-[0_0_18px_rgba(228,161,135,0.65)] ${status === "open" ? "bg-[#12090b]" : "bg-[#e4a187]"}`} />
        <motion.span
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ff5e36]/30 bg-[radial-gradient(circle,rgba(255,94,54,0.46),rgba(197,111,78,0.12)_55%,transparent_72%)] text-xl text-[#f0b29b] shadow-[0_0_45px_rgba(255,94,54,0.2)]"
          animate={status === "revealed" && !reduceMotion ? { scale: [1, 1.08, 1] } : undefined}
          transition={status === "revealed" ? { duration: 1.8, ease: "easeInOut" } : undefined}
        >
          {status === "revealed" ? "✦" : "●"}
        </motion.span>
      </div>
      <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#d4a574]">{label}</p>
    </div>
  );
}

export function ConnectionJourney({
  locale,
  connectionId,
}: {
  locale: SupportedLocale;
  connectionId: string;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const text = copy[locale];
  const [connection, setConnection] = useState<Connection | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [proposedAt, setProposedAt] = useState(defaultDateTime);
  const [minimumPlanAt] = useState(() =>
    toLocalDateTime(new Date(Date.now() + 15 * 60 * 1000)),
  );
  const [format, setFormat] = useState<SignalFormat>("CAFE");
  const [place, setPlace] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("CONTINUE");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [reschedulePlanId, setReschedulePlanId] = useState<string | null>(
    null,
  );
  const [rescheduledAt, setRescheduledAt] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [connectionData, revealData, plansData] = await Promise.all([
        jsonRequest<{ connection: Connection }>(
          `/api/connections/${connectionId}`,
        ),
        jsonRequest<{ reveal: Reveal | null }>(
          `/api/connections/${connectionId}/reveal`,
        ),
        jsonRequest<{ plans: Plan[] }>(
          `/api/connections/${connectionId}/plans`,
        ),
      ]);
      setConnection(connectionData.connection);
      setReveal(revealData.reveal);
      setPlans(plansData.plans);
      if (connectionData.connection.myOutcome) {
        setOutcome(connectionData.connection.myOutcome.outcome);
        setNote(connectionData.connection.myOutcome.note ?? "");
      }
    } catch {
      setError(text.unavailable);
    } finally {
      setLoading(false);
    }
  }, [connectionId, text.unavailable]);

  useEffect(() => {
    const initialRefreshTimer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(initialRefreshTimer);
  }, [refresh]);

  const name =
    connection?.profile?.displayName ||
    connection?.profile?.username ||
    "Embir";
  const canPlan = useMemo(
    () =>
      Boolean(
        connection &&
          [
            "REVEAL_COMPLETED",
            "CONVERSATION",
            "PLAN_PROPOSED",
            "PLAN_CONFIRMED",
            "MET",
            "CONTINUE",
            "FRIENDS",
          ].includes(connection.state),
      ),
    [connection],
  );
  const isBusy = Boolean(busy);
  const revealTitle = reveal
    ? localizeRevealPrompt(locale, reveal.prompt)
    : connection?.conversationId
      ? text.conversationReady
      : text.fallbackPrompt;

  async function submitReveal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.trim().length < 2 || isBusy) return;
    setBusy("reveal");
    setError("");
    try {
      await jsonRequest(`/api/connections/${connectionId}/reveal`, {
        method: "POST",
        body: JSON.stringify({ content: answer.trim() }),
      });
      setAnswer("");
      await refresh();
    } catch {
      setError(text.error);
    } finally {
      setBusy("");
    }
  }

  async function submitPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    const date = new Date(proposedAt);
    if (Number.isNaN(date.getTime())) {
      setError(text.error);
      return;
    }
    setBusy("plan");
    setError("");
    try {
      await jsonRequest(`/api/connections/${connectionId}/plans`, {
        method: "POST",
        body: JSON.stringify({
          proposedAt: date.toISOString(),
          format,
          approximateArea: place.trim(),
        }),
      });
      setPlace("");
      await refresh();
    } catch {
      setError(text.error);
    } finally {
      setBusy("");
    }
  }

  async function updatePlan(
    planId: string,
    action: PlanAction,
    values?: { proposedAt: string },
  ): Promise<boolean> {
    if (isBusy) return false;
    setBusy(planId);
    setError("");
    try {
      await jsonRequest(`/api/connections/${connectionId}/plans`, {
        method: "PATCH",
        body: JSON.stringify({ planId, action, ...values }),
      });
      await refresh();
      return true;
    } catch {
      setError(text.error);
      return false;
    } finally {
      setBusy("");
    }
  }

  function startReschedule(plan: Plan) {
    const current = new Date(plan.proposedAt);
    const nextValue =
      current > new Date() ? toLocalDateTime(current) : defaultDateTime();
    setReschedulePlanId(plan.id);
    setRescheduledAt(nextValue);
  }

  async function submitReschedule(
    event: FormEvent<HTMLFormElement>,
    planId: string,
  ) {
    event.preventDefault();
    const next = new Date(rescheduledAt);
    if (Number.isNaN(next.getTime())) {
      setError(text.error);
      return;
    }
    const updated = await updatePlan(planId, "reschedule", {
      proposedAt: next.toISOString(),
    });
    if (updated) {
      setReschedulePlanId(null);
      setRescheduledAt("");
    }
  }

  async function submitOutcome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    setBusy("outcome");
    setError("");
    setNotice("");
    try {
      const result = await jsonRequest<{ state: string }>(
        `/api/connections/${connectionId}/outcome`,
        {
          method: "POST",
          body: JSON.stringify({ outcome, note: note.trim() }),
        },
      );
      if (result.state === "CLOSED") {
        router.replace(localePath(locale, "/dashboard"));
        return;
      }
      setNotice(text.saved);
      await refresh();
    } catch {
      setError(text.error);
    } finally {
      setBusy("");
    }
  }

  if (loading) {
    return (
      <main
        aria-busy="true"
        className="min-h-screen bg-[#07050b] px-5 py-20 text-center text-white/45"
      >
        <p role="status">{text.loading}</p>
      </main>
    );
  }

  if (!connection) {
    return (
      <main className="min-h-screen bg-[#07050b] px-5 py-20 text-center text-white">
        <p role="alert">{error || text.unavailable}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-5 rounded-xl border border-white/15 px-4 py-2"
        >
          {text.retry}
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050b] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href={localePath(locale, "/dashboard")}
          className="text-sm text-white/45 hover:text-white"
        >
          ← {text.back}
        </Link>
        <header className="mt-8 rounded-[2rem] border border-[#d4a574]/15 bg-gradient-to-br from-[#d4a574]/[0.08] to-[#ff5e36]/[0.03] p-6 sm:p-9">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d4a574]">
            {text.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{name}</h1>
          <p className="mt-2 text-sm text-white/40">
            {connection.profile?.city ||
              connectionStateLabels[locale][connection.state] ||
              connection.state.toLowerCase().replaceAll("_", " ")}
          </p>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-200"
          >
            {error}
          </p>
        ) : null}

        <section
          aria-labelledby="reveal-title"
          className="mt-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4a574]">
            {text.revealStep}
          </p>
          <h2 id="reveal-title" className="mt-3 font-serif text-2xl">
            {revealTitle}
          </h2>
          <ResonanceSeal
            status={reveal?.bothResponded ? "revealed" : reveal?.responded ? "sealed" : "open"}
            label={reveal?.bothResponded ? text.resonanceRevealed : reveal?.responded ? text.resonanceSealed : text.resonanceOpen}
            reduceMotion={reduceMotion}
          />
          {!reveal && connection.conversationId ? (
            <Link
              href={conversationHref(locale, connection.conversationId)}
              className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#d4a574] px-5 font-semibold text-[#160c08]"
            >
              {text.conversation}
            </Link>
          ) : !reveal?.bothResponded ? (
            reveal?.responded ? (
              <p className="mt-5 rounded-2xl border border-[#d4a574]/15 bg-[#d4a574]/[0.05] p-5 text-sm text-white/55">
                {text.waiting}
              </p>
            ) : (
              <form onSubmit={submitReveal} className="mt-5">
                <label
                  htmlFor="reveal-answer"
                  className="mb-3 block text-sm text-white/45"
                >
                  {text.answer}
                </label>
                <textarea
                  id="reveal-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  maxLength={500}
                  placeholder={text.placeholder}
                  className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none focus:border-[#d4a574]/50"
                />
                <button
                  type="submit"
                  disabled={isBusy || answer.trim().length < 2}
                  aria-busy={busy === "reveal"}
                  className="mt-3 min-h-12 rounded-xl bg-[#d4a574] px-5 font-semibold text-[#160c08] disabled:opacity-40"
                >
                  {text.send}
                </button>
              </form>
            )
          ) : (
            <div className="mt-5">
              <p className="text-sm text-white/50">{text.revealed}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {reveal.responses.map((response) => (
                  <motion.blockquote
                    key={`${response.isMine ? "mine" : "theirs"}-${response.createdAt}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl border border-white/[0.08] bg-black/20 p-5 text-sm leading-relaxed text-white/70"
                  >
                    <span className="mb-2 block text-[10px] uppercase tracking-wider text-[#d4a574]">
                      {response.isMine ? text.you : name}
                    </span>
                    {response.content}
                  </motion.blockquote>
                ))}
              </div>
              {connection.conversationId ? (
                <Link
                  href={conversationHref(locale, connection.conversationId)}
                  className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-[#d4a574] px-5 font-semibold text-[#160c08]"
                >
                  {text.conversation}
                </Link>
              ) : null}
            </div>
          )}
        </section>

        {canPlan ? (
          <section
            aria-labelledby="plan-title"
            className="mt-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4a574]">
              {text.planStep}
            </p>
            <h2 id="plan-title" className="mt-3 font-serif text-2xl">
              {text.planTitle}
            </h2>
            <p className="mt-2 text-sm text-white/45">{text.planBody}</p>
            <form
              onSubmit={submitPlan}
              aria-busy={busy === "plan"}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              <label className="text-sm text-white/55">
                {text.when}
                <input
                  type="datetime-local"
                  required
                  min={minimumPlanAt}
                  value={proposedAt}
                  onChange={(event) => setProposedAt(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white"
                />
              </label>
              <label className="text-sm text-white/55">
                {text.format}
                <select
                  value={format}
                  onChange={(event) =>
                    setFormat(event.target.value as SignalFormat)
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white"
                >
                  {formats.map((item) => (
                    <option key={item} value={item}>
                      {formatLabels[locale][item]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-white/55 sm:col-span-2">
                {text.place}
                <input
                  required
                  maxLength={80}
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder={text.placePlaceholder}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white"
                />
              </label>
              <button
                type="submit"
                disabled={isBusy}
                className="min-h-12 rounded-xl border border-[#d4a574]/30 bg-[#d4a574]/10 px-5 font-semibold text-[#e3bc94] disabled:opacity-40 sm:col-span-2"
              >
                {text.propose}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {plans.length === 0 ? (
                <p className="text-sm text-white/35">{text.noPlans}</p>
              ) : (
                plans.map((plan) => (
                  <article
                    key={plan.id}
                    className="rounded-2xl border border-white/[0.07] bg-black/20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(plan.proposedAt))}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {formatLabels[locale][plan.format]} ·{" "}
                          {plan.publicPlace || plan.approximateArea}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-white/50">
                        {planStatusLabels[locale][plan.status] ||
                          plan.status.toLowerCase().replaceAll("_", " ")}
                      </span>
                    </div>

                    {plan.canAccept ||
                    plan.canCancel ||
                    plan.canReschedule ||
                    (plan.status === "CONFIRMED" &&
                      !plan.safetySharedAt) ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.canAccept ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void updatePlan(plan.id, "accept")
                            }
                            className="min-h-11 rounded-xl bg-[#d4a574] px-4 text-sm font-semibold text-[#160c08] disabled:opacity-40"
                          >
                            {text.accept}
                          </button>
                        ) : null}
                        {plan.canReschedule ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => startReschedule(plan)}
                            className="min-h-11 rounded-xl border border-[#d4a574]/20 px-4 text-sm text-[#e3bc94] disabled:opacity-40"
                          >
                            {text.reschedule}
                          </button>
                        ) : null}
                        {plan.canCancel ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void updatePlan(plan.id, "cancel")
                            }
                            className="min-h-11 rounded-xl border border-white/10 px-4 text-sm text-white/55 disabled:opacity-40"
                          >
                            {text.cancel}
                          </button>
                        ) : null}
                        {plan.status === "CONFIRMED" &&
                        !plan.safetySharedAt ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void updatePlan(
                                plan.id,
                                "mark_safety_shared",
                              )
                            }
                            className="min-h-11 rounded-xl border border-emerald-400/20 px-4 text-left text-sm text-emerald-200/70 disabled:opacity-40"
                          >
                            {text.safety}
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    {reschedulePlanId === plan.id ? (
                      <form
                        onSubmit={(event) =>
                          void submitReschedule(event, plan.id)
                        }
                        className="mt-4 rounded-xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-4"
                      >
                        <label
                          htmlFor={`reschedule-${plan.id}`}
                          className="text-sm text-white/55"
                        >
                          {text.newTime}
                        </label>
                        <input
                          id={`reschedule-${plan.id}`}
                          type="datetime-local"
                          required
                          min={minimumPlanAt}
                          value={rescheduledAt}
                          onChange={(event) =>
                            setRescheduledAt(event.target.value)
                          }
                          className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white"
                        />
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="submit"
                            disabled={isBusy}
                            className="min-h-11 rounded-xl bg-[#d4a574] px-4 text-sm font-semibold text-[#160c08] disabled:opacity-40"
                          >
                            {text.confirmReschedule}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setReschedulePlanId(null)}
                            className="min-h-11 rounded-xl border border-white/10 px-4 text-sm text-white/55 disabled:opacity-40"
                          >
                            {text.dismiss}
                          </button>
                        </div>
                      </form>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        ) : null}

        <section
          aria-labelledby="outcome-title"
          className="mt-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4a574]">
            {text.afterStep}
          </p>
          <h2 id="outcome-title" className="mt-3 font-serif text-2xl">
            {text.afterTitle}
          </h2>
          <p className="mt-2 text-sm text-white/45">{text.afterBody}</p>
          <form onSubmit={submitOutcome} className="mt-5">
            <fieldset>
              <legend className="sr-only">{text.outcomeLegend}</legend>
              <div className="grid gap-2 sm:grid-cols-5">
                {outcomes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={isBusy}
                    aria-pressed={outcome === item}
                    onClick={() => setOutcome(item)}
                    className={`min-h-12 rounded-xl border px-3 text-sm disabled:opacity-40 ${
                      outcome === item
                        ? "border-[#d4a574]/50 bg-[#d4a574]/10 text-[#e3bc94]"
                        : "border-white/[0.08] text-white/45"
                    }`}
                  >
                    {text[item]}
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor="outcome-note" className="sr-only">
              {text.note}
            </label>
            <textarea
              id="outcome-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              placeholder={text.note}
              className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none focus:border-[#d4a574]/50"
            />
            <button
              type="submit"
              disabled={isBusy}
              aria-busy={busy === "outcome"}
              className="mt-3 min-h-12 rounded-xl border border-white/10 px-5 font-semibold text-white/65 disabled:opacity-40"
            >
              {text.save}
            </button>
            {notice ? (
              <span
                role="status"
                aria-live="polite"
                className="ml-3 text-sm text-emerald-300/70"
              >
                {notice}
              </span>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
