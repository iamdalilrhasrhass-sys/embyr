"use client";
import { useState } from "react";

interface Props {
  conversationId: string;
  receiverId: string;
  isPremium?: boolean;
  onPremiumRequired?: () => void;
  onStartCall: (type: "audio" | "video") => Promise<void>;
  disabled?: boolean;
}

export default function CallButtons({
  conversationId,
  receiverId,
  isPremium = true,
  onPremiumRequired,
  onStartCall,
  disabled,
}: Props) {
  const [loading, setLoading] = useState<"audio" | "video" | null>(null);

  const handleCall = async (type: "audio" | "video") => {
    if (disabled) return;
    if (!isPremium && onPremiumRequired) {
      onPremiumRequired();
      return;
    }
    setLoading(type);
    try {
      await onStartCall(type);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={disabled || !!loading}
        onClick={() => handleCall("audio")}
        className="rounded-full w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 transition-all disabled:opacity-30"
        title={!isPremium ? "Passe Premium pour appeler" : "Appel audio"}
      >
        {loading === "audio" ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )}
        {!isPremium && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />}
      </button>
      <button
        type="button"
        disabled={disabled || !!loading}
        onClick={() => handleCall("video")}
        className="rounded-full w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 transition-all disabled:opacity-30"
        title={!isPremium ? "Passe Premium pour la visio" : "Appel visio"}
      >
        {loading === "video" ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        )}
        {!isPremium && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />}
      </button>
    </div>
  );
}
