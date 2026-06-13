'use client';

import { useState, useEffect } from 'react';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/notifications', { headers: { 'x-user-id': 'session' } });
        const data = await res.json();
        setUnread(data.unreadCount || 0);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button className="relative p-2 text-white/60 hover:text-white transition-colors" aria-label="Notifications">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  );
}
