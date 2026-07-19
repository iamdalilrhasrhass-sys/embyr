"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { MessagesErrorBoundary } from "@/components/messages/MessagesErrorBoundary";
import Navbar from "@/components/layout/Navbar";
import {
  localePath,
  supportedLocale,
  type SupportedLocale,
} from "@/components/connection-os/types";

interface MessageItem {
  id: string;
  senderId: string;
  receiverId?: string;
  content?: string | null;
  createdAt: string;
}

interface ConversationUser {
  id?: string;
  profile?: {
    displayName?: string | null;
    username?: string | null;
  } | null;
}

interface ConversationItem {
  id: string;
  user1Id: string;
  user2Id: string;
  user1?: ConversationUser | null;
  user2?: ConversationUser | null;
  messages?: MessageItem[];
}

const copy = {
  fr: {
    title: "Messages",
    loading: "Chargement…",
    signInRequired: "Connecte-toi pour accéder aux messages.",
    signIn: "Se connecter",
    empty: "Aucune conversation pour le moment",
    emptyBody: "Une conversation s’ouvre après une connexion réciproque.",
    discover: "Retour aux étincelles",
    select: "Sélectionne une conversation",
    noMessage: "Aucun message. Commence par un détail qui vous a rapprochés.",
    back: "Retour",
    placeholder: "Écris un message…",
    send: "Envoyer",
    translate: "Traduire",
    translating: "Traduction…",
    translation: "Traduction",
    sendError: "Le message n’a pas pu être envoyé.",
    refreshError: "Impossible d’actualiser les conversations.",
    live: "Actualisation active quand cet onglet est visible",
  },
  en: {
    title: "Messages",
    loading: "Loading…",
    signInRequired: "Sign in to access your messages.",
    signIn: "Sign in",
    empty: "No conversation yet",
    emptyBody: "A conversation opens after a reciprocal connection.",
    discover: "Back to sparks",
    select: "Select a conversation",
    noMessage:
      "No message yet. Start with the detail that brought you together.",
    back: "Back",
    placeholder: "Write a message…",
    send: "Send",
    translate: "Translate",
    translating: "Translating…",
    translation: "Translation",
    sendError: "The message could not be sent.",
    refreshError: "Conversations could not be refreshed.",
    live: "Refreshes while this tab is visible",
  },
  es: {
    title: "Mensajes",
    loading: "Cargando…",
    signInRequired: "Inicia sesión para acceder a tus mensajes.",
    signIn: "Iniciar sesión",
    empty: "Todavía no hay conversaciones",
    emptyBody: "Una conversación se abre después de una conexión recíproca.",
    discover: "Volver a las chispas",
    select: "Selecciona una conversación",
    noMessage: "Todavía no hay mensajes. Empieza por el detalle que os acercó.",
    back: "Atrás",
    placeholder: "Escribe un mensaje…",
    send: "Enviar",
    translate: "Traducir",
    translating: "Traduciendo…",
    translation: "Traducción",
    sendError: "No se pudo enviar el mensaje.",
    refreshError: "No se pudieron actualizar las conversaciones.",
    live: "Se actualiza mientras esta pestaña esté visible",
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

function otherParticipant(
  conversation: ConversationItem,
  myId: string | null,
): ConversationUser | null {
  return conversation.user1Id === myId
    ? (conversation.user2 ?? null)
    : (conversation.user1 ?? null);
}

function participantName(
  conversation: ConversationItem,
  myId: string | null,
): string {
  const profile = otherParticipant(conversation, myId)?.profile;
  return profile?.displayName || profile?.username || "Embir";
}

export default function MessagesPage() {
  return (
    <MessagesErrorBoundary>
      <MessagesInner />
    </MessagesErrorBoundary>
  );
}

function MessagesInner() {
  const locale = supportedLocale(useLocale());
  const textCopy = copy[locale];
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("conversation");
  });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [myLanguage, setMyLanguage] = useState(locale);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) ?? null,
    [activeConversationId, conversations],
  );
  const messages = activeConversation?.messages ?? [];

  const fetchMessages = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch("/api/messages", {
          credentials: "include",
          cache: "no-store",
          signal,
        });
        if (response.status === 401) {
          setError(textCopy.signInRequired);
          return;
        }
        if (!response.ok) throw new Error("messages_unavailable");
        const payload = await response.json();
        if (Array.isArray(payload)) {
          setConversations(payload as ConversationItem[]);
          setError("");
        }
      } catch (caught) {
        if (!(caught instanceof DOMException && caught.name === "AbortError")) {
          setError((current) => current || textCopy.refreshError);
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [textCopy.refreshError, textCopy.signInRequired],
  );

  useEffect(() => {
    const controller = new AbortController();
    const initialMessagesTimer = window.setTimeout(() => {
      void fetchMessages(controller.signal);
    }, 0);
    void Promise.all([
      fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((data: { user?: { id?: string } }) => {
          if (data.user?.id) setMyId(data.user.id);
        }),
      fetch("/api/profile/me/language", {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((data: { language?: string }) => {
          if (data.language) setMyLanguage(supportedLocale(data.language));
        }),
    ]).catch(() => {});
    return () => {
      window.clearTimeout(initialMessagesTimer);
      controller.abort();
    };
  }, [fetchMessages]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const schedule = () => {
      if (cancelled || document.visibilityState === "hidden") return;
      const delay = activeConversationId ? 5_000 : 15_000;
      timer = window.setTimeout(async () => {
        await fetchMessages();
        schedule();
      }, delay);
    };

    const handleVisibility = () => {
      if (timer) window.clearTimeout(timer);
      timer = undefined;
      if (document.visibilityState === "visible") {
        void fetchMessages().finally(schedule);
      }
    };

    schedule();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();
    if (!content || !activeConversation || !myId || sending) return;
    const receiverId =
      activeConversation.user1Id === myId
        ? activeConversation.user2Id
        : activeConversation.user1Id;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          receiverId,
          content,
        }),
      });
      if (!response.ok) throw new Error("send_failed");
      setText("");
      await fetchMessages();
    } catch {
      setError(textCopy.sendError);
    } finally {
      setSending(false);
    }
  }

  async function translateMessage(messageId: string) {
    if (translating.has(messageId) || translations[messageId]) return;
    setTranslating((current) => new Set(current).add(messageId));
    try {
      const response = await fetch("/api/messages/translate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, targetLang: myLanguage }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { translatedText?: string };
      if (payload.translatedText) {
        setTranslations((current) => ({
          ...current,
          [messageId]: payload.translatedText as string,
        }));
      }
    } finally {
      setTranslating((current) => {
        const next = new Set(current);
        next.delete(messageId);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>{textCopy.loading}</p>
      </main>
    );
  }

  if (error === textCopy.signInRequired) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center text-white">
        <span aria-hidden="true" className="text-4xl">
          ◇
        </span>
        <p className="mt-4 text-white/60">{error}</p>
        <Link
          href={localePath(locale, "/auth/login")}
          className="mt-6 rounded-full bg-gradient-to-r from-embir-rose to-embir-rose px-6 py-3 font-bold text-embir-void"
        >
          {textCopy.signIn}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex min-h-screen w-full pb-[calc(80px+env(safe-area-inset-bottom,0px))] pt-16 md:pb-0">
        <aside
          aria-label={textCopy.title}
          className={`w-full border-r border-white/[0.06] p-4 md:block md:w-80 ${activeConversation ? "hidden" : "block"}`}
        >
          <div className="mb-4 flex items-end justify-between gap-3">
            <h1 className="text-lg font-bold">{textCopy.title}</h1>
            <span className="text-[10px] text-white/25">{textCopy.live}</span>
          </div>
          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] px-4 py-10 text-center">
              <span aria-hidden="true" className="text-3xl text-embir-rose">
                ◇
              </span>
              <p className="mt-3 text-sm text-white/50">{textCopy.empty}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/30">
                {textCopy.emptyBody}
              </p>
              <Link
                href={localePath(locale, "/dashboard")}
                className="mt-5 inline-block text-xs font-semibold text-embir-rose"
              >
                {textCopy.discover} →
              </Link>
            </div>
          ) : (
            conversations.map((conversation) => {
              const lastMessage = conversation.messages?.at(-1)?.content;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveConversationId(conversation.id)}
                  aria-pressed={activeConversationId === conversation.id}
                  className={`mb-1 w-full rounded-xl p-3 text-left transition ${activeConversationId === conversation.id ? "border border-embir-rose/20 bg-embir-rose/10" : "border border-transparent hover:bg-white/[0.03]"}`}
                >
                  <span className="block text-sm font-semibold">
                    {participantName(conversation, myId)}
                  </span>
                  <span className="block truncate text-xs text-white/35">
                    {lastMessage || textCopy.noMessage}
                  </span>
                </button>
              );
            })
          )}
        </aside>

        <section
          aria-label={
            activeConversation
              ? participantName(activeConversation, myId)
              : textCopy.title
          }
          className="flex min-w-0 flex-1 flex-col"
        >
          {!activeConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
              <span aria-hidden="true" className="text-5xl text-white/15">
                ◇
              </span>
              <p className="text-white/40">
                {conversations.length === 0 ? textCopy.empty : textCopy.select}
              </p>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-white/[0.06] p-4">
                <button
                  type="button"
                  onClick={() => setActiveConversationId(null)}
                  className="rounded-lg p-2 text-white/55 hover:bg-white/[0.04] hover:text-white md:hidden"
                  aria-label={textCopy.back}
                >
                  ←
                </button>
                <h2 className="font-semibold">
                  {participantName(activeConversation, myId)}
                </h2>
              </header>
              <div
                className="flex-1 space-y-3 overflow-y-auto p-4"
                aria-live="polite"
              >
                {messages.length === 0 ? (
                  <p className="mt-8 text-center text-sm text-white/35">
                    {textCopy.noMessage}
                  </p>
                ) : null}
                {messages.map((message) => {
                  const mine = message.senderId === myId;
                  const content = message.content ?? "";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl border px-4 py-2.5 text-sm sm:max-w-md ${mine ? "border-embir-rose/20 bg-gradient-to-r from-embir-rose-deep/15 to-embir-rose/10" : "border-white/[0.06] bg-white/[0.045]"}`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {content}
                        </p>
                        {!mine && content && !translations[message.id] ? (
                          <button
                            type="button"
                            onClick={() => void translateMessage(message.id)}
                            disabled={translating.has(message.id)}
                            className="mt-2 text-[10px] font-semibold text-embir-rose disabled:opacity-40"
                          >
                            {translating.has(message.id)
                              ? textCopy.translating
                              : `🌐 ${textCopy.translate}`}
                          </button>
                        ) : null}
                        {translations[message.id] ? (
                          <div className="mt-2 border-t border-white/[0.08] pt-2">
                            <span className="text-[10px] text-white/25">
                              {textCopy.translation}
                            </span>
                            <p className="mt-0.5 text-xs italic text-white/65">
                              {translations[message.id]}
                            </p>
                          </div>
                        ) : null}
                        <time
                          dateTime={message.createdAt}
                          className="mt-1 block text-[10px] text-white/25"
                        >
                          {new Intl.DateTimeFormat(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(message.createdAt))}
                        </time>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
              {error ? (
                <p
                  role="alert"
                  className="border-t border-embir-rose-deep/10 bg-embir-rose-deep/[0.04] px-4 py-2 text-xs text-embir-rose-soft"
                >
                  {error}
                </p>
              ) : null}
              <form
                onSubmit={sendMessage}
                className="flex items-end gap-3 border-t border-white/[0.06] p-4"
              >
                <label className="sr-only" htmlFor="message-input">
                  {textCopy.placeholder}
                </label>
                <textarea
                  id="message-input"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={1}
                  maxLength={2000}
                  placeholder={textCopy.placeholder}
                  className="min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-embir-rose/40 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending || !myId}
                  className="min-h-11 shrink-0 rounded-xl bg-gradient-to-r from-embir-rose to-embir-rose px-5 py-3 text-sm font-bold text-embir-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {sending ? "…" : textCopy.send}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
