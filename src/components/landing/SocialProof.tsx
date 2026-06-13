"use client";
import { useEffect, useState } from "react";

export default function SocialProof() {
  const [onlineCount, setOnlineCount] = useState(42); // starts at 42, increments
  const [totalUsers, setTotalUsers] = useState(156);

  useEffect(() => {
    // Try to fetch real counts from API
    fetch("/api/profiles/latest")
      .then((r) => r.json())
      .then((d) => {
        if (d.total) setTotalUsers(d.total);
      })
      .catch(() => {});

    // Simulate live counter (fluctuates)
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, prev + delta);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="flex items-center gap-2 text-sm text-white/40">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        <span>
          <strong className="text-white/70">{onlineCount}</strong> personnes
          explorent Embir maintenant
        </span>
      </div>
      <div className="text-xs text-white/30">
        <strong className="text-white/50">{totalUsers.toLocaleString()}</strong>{" "}
        membres ont rejoint la communauté
      </div>
    </div>
  );
}
