"use client";
import { useState, useEffect } from "react";

interface PremiumState {
  isPremium: boolean;
  loading: boolean;
  error: string | null;
}

let cached: PremiumState | null = null;

export function usePremium(): PremiumState {
  const [state, setState] = useState<PremiumState>(
    cached ?? { isPremium: false, loading: true, error: null }
  );

  useEffect(() => {
    if (cached) {
      setState(cached);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        const isPremium =
          data?.user?.profile?.isPremium === true ||
          data?.user?.isPremium === true;
        cached = { isPremium, loading: false, error: null };
        setState(cached);
      })
      .catch(() => {
        cached = { isPremium: false, loading: false, error: "Erreur réseau" };
        setState(cached);
      });
  }, []);

  return state;
}
