"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function MobileSheet({
  open,
  onClose,
  children,
  title,
}: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        sheetRef.current?.focus();
      }, 100);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        clearTimeout(timer);
        previousFocus.current?.focus();
      };
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Menu"}
        tabIndex={-1}
        className={[
          "relative z-10 w-full max-w-lg",
          "rounded-t-[var(--eb-radius-lg,24px)]",
          "border border-[var(--e21-line)] bg-[var(--e21-void,#09060c)]",
          "shadow-[0_-8px_40px_rgba(0,0,0,0.6)]",
          "pb-[env(safe-area-inset-bottom,0px)]",
          "animate-[slideUp_250ms_ease-out]",
        ].join(" ")}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--e21-line)]" />
        </div>

        {title && (
          <div className="px-6 pt-2 pb-3 font-serif text-lg text-[var(--e21-bone)]">
            {title}
          </div>
        )}

        <div className="px-4 pb-6">{children}</div>
      </div>
    </div>
  );
}
