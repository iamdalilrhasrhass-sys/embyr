"use client";

import { useState } from "react";
import Link from "next/link";
export default function RedditSetupPage() {
  const [step, setStep] = useState<"start" | "create" | "done">("start");
  const [clientId, setClientId] = useState("");

  const handleCopyStep1 = () => {
    navigator.clipboard.writeText(
      `Ta mission si tu l'acceptes (30 secondes) :
1. Ouvre Safari (pas Chrome, pas l'app Reddit)
2. Va sur https://www.reddit.com/prefs/apps
3. Clique "Create App" ou "Create Another App"
4. Remplis :
   - Name : Embir
   - Type : script (coche "script")
   - redirect uri : http://localhost:8080
5. Clique "Create App"
6. Copie le code sous "personal use script" et envoie-le moi`
    );
    alert("Copié ! Colle ce message dans Telegram à Hermes si besoin");
  };

  return (
    <main className="emb-page min-h-screen flex items-center justify-center p-4">
      <div className="emb-container max-w-md text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className="text-2xl font-black text-white mb-3">
            Reddit API - Configuration
          </h1>
          <p className="text-white/50 text-sm mb-6">
            Suis ces étapes sur ton téléphone. Safari fonctionne mieux que Chrome sur Reddit.
          </p>

          <div className="space-y-4 text-left">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5">1</span>
                <span className="text-white font-semibold text-sm">Ouvre ce lien</span>
              </div>
              <a
                href="https://www.reddit.com/prefs/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 text-sm underline break-all"
              >
                reddit.com/prefs/apps
              </a>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5">2</span>
                <span className="text-white font-semibold text-sm">Create App (ou Create Another App)</span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-400/10 bg-amber-500/[0.04] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5">3</span>
                <span className="text-white font-semibold text-sm">Remplis ça :</span>
              </div>
              <div className="text-white/60 text-xs space-y-1 font-mono bg-black/20 rounded-lg p-3">
                <div><span className="text-white/80">Name :</span> Embir</div>
                <div><span className="text-white/80">Type :</span> ✅ Script (personal use script)</div>
                <div><span className="text-white/80">Redirect URI :</span> http://localhost:8080</div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5">4</span>
                <span className="text-white font-semibold text-sm">Clique "Create App"</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-400/10 bg-emerald-500/[0.04] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5">5</span>
                <span className="text-white font-semibold text-sm">Copie le client_id</span>
              </div>
              <p className="text-white/50 text-xs">
                C'est la ligne juste sous <strong className="text-white">"personal use script"</strong>. 
                Ça ressemble à un code du genre : <span className="font-mono text-amber-400">abc123def45</span>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCopyStep1}
              className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.10] transition-all"
            >
              📋 Copier les instructions complètes
            </button>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-white/40 text-xs mb-2">
                Une fois le code récupéré, envoie-le moi sur Telegram
              </p>
              <input
                type="text"
                placeholder="ou colle le client_id ici..."
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20"
                onChange={(e) => console.log(e.target.value)}
              />
              <button className="mt-2 w-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-3 text-sm font-bold text-white">
                Envoyer à Hermes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
