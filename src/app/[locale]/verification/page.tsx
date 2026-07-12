"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
export default function VerificationPage() {
  const [step, setStep] = useState<"request" | "code" | "upload" | "done">("request");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verification/request", { method: "POST" });
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setCode(d.code);
      setStep("code");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  };

  const handleUpload = async () => {
    if (!file) { setError("Sélectionne une photo."); return; }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch("/api/verification/upload", { method: "POST", body: formData });
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setStep("done");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "Arial, sans-serif" }}>
          Vérification du profil
        </h1>

        {step === "request" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-xl font-bold mb-3">Obtiens ton badge Vérifié</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Prends un selfie avec le code unique écrit <strong>à la main sur un papier</strong> visible.
              La demande sera examinée avant l’attribution éventuelle du badge. Aucun délai n’est garanti.
            </p>
            <button onClick={handleRequest} disabled={loading} className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50">
              {loading ? "Génération du code..." : "Générer mon code"}
            </button>
          </motion.div>
        )}

        {step === "code" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-[var(--color-premium-purple)]/20 bg-gradient-to-b from-[var(--color-premium-rose)]/10 to-[var(--color-premium-purple)]/5 backdrop-blur-xl">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-bold mb-3">Ton code unique</h2>
            <div className="text-5xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-rose)] mb-6 tracking-widest">
              {code}
            </div>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Écris ce code <strong>à la main sur un papier</strong>. Tiens le papier bien visible dans ton selfie.
              Ton visage ET le code doivent être nets.
            </p>
            <div className="mb-4">
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-[var(--color-premium-purple)]/20 file:bg-[var(--color-premium-purple)]/10 file:text-[var(--color-premium-rose)] file:font-semibold" />
            </div>
            <button onClick={handleUpload} disabled={loading || !file} className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50">
              {loading ? "Envoi en cours..." : "Envoyer la photo"}
            </button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-green-400/20 bg-gradient-to-b from-green-500/10 to-[var(--color-premium-purple)]/5 backdrop-blur-xl">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-3">Photo envoyée !</h2>
            <p className="text-gray-300 text-sm mb-2">Ta demande a bien été enregistrée. Aucun délai de décision n’est garanti.</p>
            <p className="text-gray-500 text-xs">Tu recevras une notification une fois la vérification validée.</p>
          </motion.div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
        )}
      </div>
    </main>
  );
}
