'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/notifications?limit=1', { cache: 'no-store' });
        if (!res.ok) {
          if (res.status === 401) setUnread(0);
          return;
        }
        const data = (await res.json()) as { unreadCount?: unknown };
        const count = Number(data.unreadCount);
        setUnread(Number.isFinite(count) && count > 0 ? Math.floor(count) : 0);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    window.addEventListener('embir:notifications-updated', fetchCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener('embir:notifications-updated', fetchCount);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      className="relative flex h-11 w-11 items-center justify-center rounded-xl text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-embir-blush"
      aria-label={unread > 0 ? `Notifications, ${unread} non lues` : 'Notifications'}
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {unread > 0 && (
        <span aria-live="polite" className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
