"use client";
import { useEffect, useState, useRef } from "react";

interface Props {
  open: boolean;
  type: "audio" | "video";
  direction: "outgoing" | "incoming";
  callerName?: string;
  onAccept: () => void;
  onDecline: () => void;
  onEnd: () => void;
  status: "ringing" | "accepted" | "ended" | "declined";
}

export default function CallModal({
  open,
  type,
  direction,
  callerName,
  onAccept,
  onDecline,
  onEnd,
  status,
}: Props) {
  if (!open) return null;

  const isVideo = type === "video";
  const isRinging = status === "ringing";
  const isActive = status === "accepted";
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 rounded-3xl bg-[#0F0A1A] border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.2)] p-8 text-center">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl">
          {isVideo ? "📹" : "📞"}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">
          {direction === "incoming" ? (callerName || "Appel entrant") : (callerName || "Appel sortant")}
        </h3>
        <p className="text-sm text-white/50 mb-6">
          {isRinging && (direction === "incoming" ? "Appel audio entrant..." : "Sonnerie...")}
          {isActive && `En cours • ${fmt(duration)}`}
          {status === "ended" && "Appel terminé"}
          {status === "declined" && "Appel refusé"}
        </p>

        {/* Call animation ring */}
        {isRinging && (
          <div className="mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 animate-ping absolute" />
            <div className="w-16 h-16 rounded-full bg-green-500/30 relative" />
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          {isRinging && direction === "incoming" && (
            <button
              onClick={onAccept}
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07" />
              </svg>
            </button>
          )}
          {(isRinging || isActive) && (
            <button
              onClick={isActive ? onEnd : onDecline}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2" />
              </svg>
            </button>
          )}
          {(status === "ended" || status === "declined") && (
            <button
              onClick={onEnd}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
