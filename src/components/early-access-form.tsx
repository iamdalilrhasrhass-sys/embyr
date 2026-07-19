"use client";
import { useState } from "react";
import Link from "next/link";

export default function EarlyAccessForm() {
  const [formData, setFormData] = useState({
    email: "",
    city: "",
    orientation: "",
    preference: "",
    relationType: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMsg("Vous devez accepter de recevoir des communications.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "early_access_page" }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center relative z-10 space-y-6 py-8">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <span className="text-4xl">✨</span>
        </div>
        <h2 className="text-3xl font-serif text-white">Ton accès est réservé.</h2>
        <p className="text-white/60 leading-relaxed text-sm">
          Ton accès prioritaire est bien pris en compte. Tu recevras une invitation dès que ta zone sera ouverte pour créer ton univers personnel.
        </p>
        <Link href="/" className="inline-block mt-4 text-embir-rose hover:text-embir-blush transition-colors text-sm font-bold uppercase tracking-widest">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm text-center backdrop-blur-md">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest">Ville</label>
            <input
              type="text"
              required
              placeholder="Ex: Paris"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-embir-rose/40 focus:ring-1 focus:ring-embir-rose/20 transition-all text-white placeholder:text-white/20 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest">Je suis</label>
            <select
              required
              value={formData.orientation}
              onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
              className="w-full bg-[#110b1c] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-embir-rose/40 focus:ring-1 focus:ring-embir-rose/20 transition-all text-white text-sm appearance-none"
            >
              <option value="" disabled>Orientation...</option>
              <option value="hetero">Hétéro</option>
              <option value="gay">Gay</option>
              <option value="lesbienne">Lesbienne</option>
              <option value="bi">Bisexuel(le)</option>
              <option value="queer">Queer / Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest">Je cherche</label>
            <select
              required
              value={formData.preference}
              onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
              className="w-full bg-[#110b1c] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-embir-rose/40 focus:ring-1 focus:ring-embir-rose/20 transition-all text-white text-sm appearance-none"
            >
              <option value="" disabled>Préférence...</option>
              <option value="hommes">Des hommes</option>
              <option value="femmes">Des femmes</option>
              <option value="tout">Les deux / Peu importe</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest">Pour</label>
            <select
              required
              value={formData.relationType}
              onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}
              className="w-full bg-[#110b1c] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-embir-rose/40 focus:ring-1 focus:ring-embir-rose/20 transition-all text-white text-sm appearance-none"
            >
              <option value="" disabled>Type de relation...</option>
              <option value="serieux">Relation sérieuse</option>
              <option value="decouverte">Découverte / Date</option>
              <option value="amitie">Connexions amicales</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest">Email (pour recevoir l'invitation)</label>
          <input
            type="email"
            required
            placeholder="votre@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-embir-rose/40 focus:ring-1 focus:ring-embir-rose/20 transition-all text-white placeholder:text-white/20 text-sm"
          />
        </div>

        <label className="flex items-start space-x-3 cursor-pointer pt-4">
          <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
            <input
              type="checkbox"
              required
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-white/[0.03] checked:bg-embir-rose checked:border-embir-rose transition-colors"
            />
            <svg className="absolute w-3 h-3 text-embir-void pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs text-white/40 leading-relaxed">
            J'accepte de recevoir mon invitation et des mises à jour sur l'ouverture de ma zone par email.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-embir-rose text-embir-void font-bold text-sm py-4 rounded-xl transition-all disabled:opacity-50 hover:bg-embir-blush mt-6"
        >
          {status === "loading" ? "Inscription..." : "Demander mon accès"}
        </button>
      </form>
    </div>
  );
}
