"use client";

import Link from "next/link";
import type {
  ActiveConnection,
  ConnectionProfile,
  ConnectionUser,
  SupportedLocale,
} from "@/components/connection-os/types";
import { localePath } from "@/components/connection-os/types";

interface ActiveConnectionsProps {
  locale: SupportedLocale;
  connections: ActiveConnection[];
  myId: string | null;
  loading: boolean;
}

const copy = {
  fr: {
    step: "03 · Connexions actives",
    title: "Fais progresser ce qui est réciproque",
    body: "Embir limite volontairement les connexions actives : répondre, avancer ou clôturer vaut mieux que collectionner.",
    empty:
      "Aucune connexion réciproque pour le moment. Une étincelle apparaît ici uniquement si l’envie est mutuelle.",
    open: "Ouvrir la conversation",
    reveal: "Révélation à compléter",
    waiting: "En attente de l’autre personne",
    reviewPlan: "Voir la proposition",
    prepareMeeting: "Préparer la rencontre",
    paused: "Connexion en pause",
    continue: "Faire avancer la connexion",
    updated: "Mise à jour",
    limit: "connexions à faire avancer",
  },
  en: {
    step: "03 · Active connections",
    title: "Move reciprocal connections forward",
    body: "Embir intentionally limits active connections: replying, progressing or closing is better than collecting.",
    empty:
      "No reciprocal connection yet. A spark appears here only when the interest is mutual.",
    open: "Open conversation",
    reveal: "Reveal to complete",
    waiting: "Waiting for the other person",
    reviewPlan: "Review proposal",
    prepareMeeting: "Prepare the meetup",
    paused: "Connection paused",
    continue: "Move the connection forward",
    updated: "Updated",
    limit: "connections to move forward",
  },
  es: {
    step: "03 · Conexiones activas",
    title: "Haz avanzar lo que es recíproco",
    body: "Embir limita voluntariamente las conexiones activas: responder, avanzar o cerrar es mejor que acumular.",
    empty:
      "Todavía no hay conexión recíproca. Una chispa aparece aquí solo cuando el interés es mutuo.",
    open: "Abrir conversación",
    reveal: "Revelación por completar",
    waiting: "Esperando a la otra persona",
    reviewPlan: "Ver la propuesta",
    prepareMeeting: "Preparar el encuentro",
    paused: "Conexión en pausa",
    continue: "Hacer avanzar la conexión",
    updated: "Actualizada",
    limit: "conexiones por hacer avanzar",
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

const stateLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    RECIPROCAL: "Réciproque",
    REVEAL_PENDING: "Révélation à compléter",
    REVEAL_COMPLETED: "Révélation partagée",
    CONVERSATION: "Conversation",
    PLAN_PROPOSED: "Proposition en attente",
    PLAN_CONFIRMED: "Rencontre confirmée",
    MET: "Rencontre réalisée",
    CONTINUE: "À poursuivre",
    FRIENDS: "Amitié",
    PAUSED: "En pause",
    mutual: "Réciproque",
    active: "Active",
  },
  en: {
    RECIPROCAL: "Reciprocal",
    REVEAL_PENDING: "Reveal to complete",
    REVEAL_COMPLETED: "Reveal shared",
    CONVERSATION: "Conversation",
    PLAN_PROPOSED: "Plan awaiting reply",
    PLAN_CONFIRMED: "Meetup confirmed",
    MET: "Met",
    CONTINUE: "Keep going",
    FRIENDS: "Friendship",
    PAUSED: "Paused",
    mutual: "Reciprocal",
    active: "Active",
  },
  es: {
    RECIPROCAL: "Recíproca",
    REVEAL_PENDING: "Revelación pendiente",
    REVEAL_COMPLETED: "Revelación compartida",
    CONVERSATION: "Conversación",
    PLAN_PROPOSED: "Propuesta pendiente",
    PLAN_CONFIRMED: "Encuentro confirmado",
    MET: "Encuentro realizado",
    CONTINUE: "Continuar",
    FRIENDS: "Amistad",
    PAUSED: "En pausa",
    mutual: "Recíproca",
    active: "Activa",
  },
};

function otherUser(
  connection: ActiveConnection,
  myId: string | null,
): ConnectionUser | null {
  if (connection.otherUser) return connection.otherUser;
  if (connection.user1Id && connection.user1Id === myId)
    return connection.user2 ?? null;
  if (connection.user2Id && connection.user2Id === myId)
    return connection.user1 ?? null;
  return connection.user2 ?? connection.user1 ?? null;
}

function connectionProfile(
  connection: ActiveConnection,
  myId: string | null,
): ConnectionProfile {
  return connection.profile ?? otherUser(connection, myId)?.profile ?? {};
}

function nextActionLabel(
  connection: ActiveConnection,
  state: string,
  text: (typeof copy)[SupportedLocale],
): string {
  if (state === "REVEAL_PENDING") {
    return connection.nextAction === "wait_for_reveal"
      ? text.waiting
      : text.reveal;
  }
  if (connection.nextAction === "review_plan" || state === "PLAN_PROPOSED") {
    return text.reviewPlan;
  }
  if (
    connection.nextAction === "prepare_meeting" ||
    state === "PLAN_CONFIRMED"
  ) {
    return text.prepareMeeting;
  }
  if (state === "PAUSED") return text.paused;
  if (connection.conversationId) return text.open;
  return text.continue;
}

export function ActiveConnections({
  locale,
  connections,
  myId,
  loading,
}: ActiveConnectionsProps) {
  const text = copy[locale];
  const activeConnections = connections.slice(0, 5);

  return (
    <section
      aria-labelledby="connections-title"
      aria-busy={loading}
      className="rounded-[2rem] border border-[#d4a574]/15 bg-[#d4a574]/[0.025] p-5 sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d4a574]">
            {text.step}
          </p>
          <h2
            id="connections-title"
            className="font-serif text-2xl text-white sm:text-3xl"
          >
            {text.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/45">
            {text.body}
          </p>
        </div>
        <div
          aria-live="polite"
          className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[11px] text-white/40"
        >
          <strong className="text-white/75">{activeConnections.length}</strong>{" "}
          {text.limit}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="h-28 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.025]"
            />
          ))}
        </div>
      ) : activeConnections.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/[0.09] p-7 text-center">
          <span aria-hidden="true" className="text-2xl text-[#d4a574]">
            ◇
          </span>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/40">
            {text.empty}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeConnections.map((connection) => {
            const profile = connectionProfile(connection, myId);
            const name = profile.displayName || profile.username || "Embir";
            const state = connection.state || connection.status || "active";
            const dateValue = connection.lastMessageAt || connection.updatedAt;
            const connectionId = connection.matchId ?? connection.id;
            if (!connectionId) return null;
            const nextLabel = nextActionLabel(connection, state, text);
            return (
              <article
                key={connection.id ?? connection.matchId}
                className="rounded-2xl border border-white/[0.07] bg-black/15 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5e36]/20 to-[#d4a574]/20 font-serif text-white/80"
                  >
                    {name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {name}
                    </h3>
                    <p className="truncate text-xs text-white/30">
                      {profile.city ||
                        stateLabels[locale][state] ||
                        state.toLowerCase().replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-semibold text-emerald-300/75">
                    {stateLabels[locale][state] ||
                      state.toLowerCase().replaceAll("_", " ")}
                  </span>
                  {dateValue ? (
                    <time
                      dateTime={dateValue}
                      className="text-[10px] text-white/20"
                    >
                      {text.updated}{" "}
                      {new Intl.DateTimeFormat(locale, {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(dateValue))}
                    </time>
                  ) : null}
                </div>
                <Link
                  href={localePath(locale, `/connections/${connectionId}`)}
                  aria-label={`${nextLabel} — ${name}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-3 py-2.5 text-center text-xs font-semibold text-[#e3bc94] transition hover:bg-[#d4a574]/10"
                >
                  {nextLabel}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
