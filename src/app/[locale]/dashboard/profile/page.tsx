"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    city: "",
    genderIdentity: "",
    lookingFor: "",
    description: ""
  });

  useEffect(() => {
    fetch("/api/profile/me")
      .then(res => {
        if (!res.ok) throw new Error("Non autorisé");
        return res.json();
      })
      .then(data => {
        setFormData({
          username: data.username || "",
          age: data.age?.toString() || "",
          city: data.city || "",
          genderIdentity: data.genderIdentity || "",
          lookingFor: data.lookingFor || "",
          description: data.description || ""
        });
        setLoading(false);
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
        Modifier mon Profil
      </h1>
      <p className="text-white/40 text-sm mb-2">
        Ton profil doit être complété pour être visible dans les membres.
      </p>
      <p className="text-white/30 text-xs mb-8">
        Plus ton profil est complet, plus il sera visible.
      </p>
      
      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Profil enregistré. Tu peux maintenant découvrir les membres.
          </div>
        )}
        
        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Pseudo *</label>
              <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Âge *</label>
              <input type="number" min="18" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Ville</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Genre</label>
              <select value={formData.genderIdentity} onChange={e => setFormData({...formData, genderIdentity: e.target.value})}
                className="w-full bg-[var(--color-premium-dark)] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors">
                <option value="">Sélectionne</option>
                <option value="FEMME_HETERO">Femme hétéro</option>
                <option value="FEMME_BI">Femme bi</option>
                <option value="HOMME_HETERO">Homme hétéro</option>
                <option value="HOMME_GAY">Homme gay</option>
                <option value="HOMME_BI">Homme bi</option>
                <option value="NON_BINAIRE">Non-binaire</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Je recherche</label>
              <select value={formData.lookingFor} onChange={e => setFormData({...formData, lookingFor: e.target.value})}
                className="w-full bg-[var(--color-premium-dark)] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors">
                <option value="">Sélectionne</option>
                <option value="HOMME">Homme</option>
                <option value="FEMME">Femme</option>
                <option value="NON_BINAIRE">Non-binaire</option>
                <option value="TOUS">Tous</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Description</label>
            <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
              placeholder="Parle de toi, ce que tu recherches..." />
          </div>
        </div>

        {/* Photos */}
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Photos</label>
          <div className="flex gap-3">
            <button type="button"
              onClick={() => alert("L'upload de photos sera disponible très prochainement.")}
              className="w-20 h-20 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-white/50 hover:border-white/[0.2] transition-colors text-2xl">+</button>
            <button type="button" className="w-20 h-20 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] flex items-center justify-center text-white/20 text-2xl cursor-default">+</button>
            <button type="button" className="w-20 h-20 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] flex items-center justify-center text-white/20 text-2xl cursor-default">+</button>
          </div>
          <p className="text-xs text-white/30 mt-3">L&apos;ajout de médias sera bientôt disponible. Ton profil peut déjà être complété.</p>
        </div>

        {/* Save */}
        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300"
            style={{ background: saving ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
            {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
