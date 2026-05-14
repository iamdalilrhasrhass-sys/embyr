"use client";
import { useRef, useState, useCallback } from "react";

interface Props {
  onSendAudio: (blob: Blob, duration: number) => Promise<void>;
  disabled?: boolean;
  isPremium?: boolean;
  onPremiumRequired?: () => void;
}

export default function VoiceRecorderButton({
  onSendAudio,
  disabled,
  isPremium = true,
  onPremiumRequired,
}: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const startedAtRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    if (disabled) return;
    if (!isPremium && onPremiumRequired) {
      onPremiumRequired();
      return;
    }
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const duration = Math.round((Date.now() - startedAtRef.current) / 1000);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        if (blob.size > 0) await onSendAudio(blob, duration);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Micro inaccessible. Vérifie l'autorisation dans les paramètres.");
    }
  }, [disabled, isPremium, onPremiumRequired, onSendAudio]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="absolute -top-8 left-0 right-0 text-center text-xs text-red-400 bg-black/60 rounded px-2 py-1">
          {error}
        </span>
      )}
      {!recording ? (
        <button
          type="button"
          disabled={disabled}
          onClick={startRecording}
          className="relative rounded-full w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 transition-all disabled:opacity-30"
          title={!isPremium ? "Passe Premium pour les vocaux" : "Enregistrer un vocal"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          {!isPremium && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={stopRecording}
          className="relative rounded-full w-10 h-10 flex items-center justify-center bg-red-500/30 border border-red-400/50 animate-pulse"
          title="Arrêter l'enregistrement"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
          <span className="absolute -top-6 text-[10px] text-red-300 whitespace-nowrap">
            Enregistrement...
          </span>
        </button>
      )}
    </div>
  );
}
