"use client";
import { useRef, useState } from "react";

interface Props {
  url: string;
  duration?: number | null;
  mine?: boolean;
}

export default function AudioMessageBubble({ url, duration, mine }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 max-w-[260px] ${
        mine
          ? "ml-auto bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/20"
          : "mr-auto bg-white/5 border border-white/10"
      }`}
    >
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-300"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="text-[10px] text-white/50 mt-1">
          {playing
            ? formatTime(currentTime)
            : duration
            ? `Vocal • ${formatTime(duration)}`
            : "Vocal"}
        </div>
      </div>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={() => { setPlaying(false); setCurrentTime(0); }}
        onLoadedMetadata={() => {
          if (audioRef.current) audioRef.current.currentTime = 0;
        }}
      />
    </div>
  );
}
