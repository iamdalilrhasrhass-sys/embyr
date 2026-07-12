"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { localePath, supportedLocale } from "@/components/connection-os/types";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  readAt: string | null;
  link: string | null;
  createdAt: string;
}

interface NotificationResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export default function NotificationsPage() {
  const params = useParams<{ locale?: string }>();
  const locale = supportedLocale(params.locale ?? "en");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/notifications?limit=50", {
        cache: "no-store",
        signal,
      });
      if (!response.ok) throw new Error(response.status === 401 ? "unauthorized" : "request_failed");
      const data = (await response.json()) as NotificationResponse;
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number.isFinite(data.unreadCount) ? data.unreadCount : 0);
      setError("");
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError("Impossible de charger les notifications pour le moment.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadNotifications(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadNotifications]);

  const announceUpdate = () => window.dispatchEvent(new Event("embir:notifications-updated"));

  const markRead = (notification: NotificationItem) => {
    if (notification.read) return;
    setNotifications((items) =>
      items.map((item) =>
        item.id === notification.id
          ? { ...item, read: true, readAt: new Date().toISOString() }
          : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    trackAnalyticsEvent("notification_opened", { notificationType: notification.type });
    void fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read", notificationId: notification.id }),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) void loadNotifications();
      else announceUpdate();
    }).catch(() => void loadNotifications());
  };

  const markAllRead = async () => {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read_all" }),
    });
    if (!response.ok) {
      setError("La mise à jour a échoué. Réessaie.");
      return;
    }
    const now = new Date().toISOString();
    setNotifications((items) => items.map((item) => ({ ...item, read: true, readAt: item.readAt ?? now })));
    setUnreadCount(0);
    announceUpdate();
  };

  return (
    <AppShell>
      <main className="min-h-screen pb-20 pt-4 text-[var(--eb-text-primary)] md:pb-8" style={{ background: "var(--eb-bg-base)" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-[var(--eb-font-display)]">Notifications</h1>
              <p className="mt-1 text-sm text-[var(--eb-text-secondary)]" aria-live="polite">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tu es à jour"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="rounded-full border border-[var(--eb-border-soft)] px-4 py-2 text-xs text-[var(--eb-text-secondary)] transition-colors hover:text-[var(--eb-text-primary)]"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20" role="status" aria-label="Chargement">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)]" />
            </div>
          ) : error ? (
            <div className="rounded-[var(--eb-radius-card)] border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-200" role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => void loadNotifications()} className="mt-3 underline underline-offset-4">
                Réessayer
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-[var(--eb-radius-card)] border border-[var(--eb-border-soft)] bg-[var(--eb-bg-elev-1)] p-8 text-center">
              <p className="text-lg">Rien de nouveau pour l’instant.</p>
              <p className="mt-2 text-sm text-[var(--eb-text-secondary)]">Les résonances et nouvelles étapes apparaîtront ici.</p>
            </div>
          ) : (
            <ol className="space-y-3">
              {notifications.map((notification) => {
                const content = (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-semibold text-[var(--eb-text-primary)]">{notification.title}</h2>
                      {!notification.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--eb-accent)]" aria-label="Non lue" />}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--eb-text-secondary)]">{notification.body}</p>
                    <time className="mt-3 block text-xs text-[var(--eb-text-muted)]" dateTime={notification.createdAt}>
                      {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}
                    </time>
                  </>
                );

                return (
                  <li key={notification.id}>
                    {notification.link ? (
                      <Link
                        href={/^\/(?:fr|en|es)(?:\/|$)/.test(notification.link)
                          ? notification.link
                          : localePath(locale, notification.link)}
                        onClick={() => markRead(notification)}
                        className={`block rounded-[var(--eb-radius-card)] border p-5 transition-colors hover:border-[var(--eb-accent)]/40 ${
                          notification.read
                            ? "border-[var(--eb-border-soft)] bg-[var(--eb-bg-elev-1)] opacity-75"
                            : "border-[var(--eb-accent)]/20 bg-[var(--eb-bg-elev-2)]"
                        }`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(notification)}
                        className={`w-full rounded-[var(--eb-radius-card)] border p-5 text-left transition-colors ${
                          notification.read
                            ? "border-[var(--eb-border-soft)] bg-[var(--eb-bg-elev-1)] opacity-75"
                            : "border-[var(--eb-accent)]/20 bg-[var(--eb-bg-elev-2)]"
                        }`}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </main>
    </AppShell>
  );
}
