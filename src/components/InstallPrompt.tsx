"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!sessionStorage.getItem("embir-install-dismissed")) {
        setTimeout(() => setVisible(true), 5000);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("embir-install-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="rounded-2xl border border-[#d4a574]/30 bg-[#0a0614]/95 backdrop-blur-xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a574] to-[#ff5e36] flex items-center justify-center text-[#0a0614] font-black flex-shrink-0">
                E
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Install Embir</p>
                <p className="text-xs text-white/50 mt-0.5">Add to your home screen for the full experience</p>
              </div>
              <button onClick={handleDismiss} className="text-white/30 hover:text-white/60 transition text-lg leading-none">
                {"\u00d7"}
              </button>
            </div>
            <button
              onClick={handleInstall}
              className="mt-3 w-full px-4 py-2.5 rounded-xl bg-[#d4a574] text-[#0a0614] font-bold text-sm hover:bg-[#e8c4a2] transition"
            >
              Install now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
