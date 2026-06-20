"use client";
import { useState } from "react";
const PLANS = [
  { name: "Grindr XTRA", price: 24.99 },
  { name: "Grindr Unlimited", price: 39.99 },
  { name: "Tinder Platinum", price: 29.99 },
  { name: "Scruff Pro", price: 14.99 },
  { name: "None — I'm done paying", price: 0 },
];

export default function GrindrCostCalculator() {
  const [months, setMonths] = useState(12);
  const [selected, setSelected] = useState(0);
  const [shared, setShared] = useState(false);

  const cost = (months * PLANS[selected].price).toFixed(0);
  const savings = (months * (PLANS[selected].price || 15)).toFixed(0);

  const shareText = encodeURIComponent(
    `I've spent $${cost} on dating apps in ${months} months. With @embir_app I'd have paid $0. How much have you wasted?`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=https://embir.xyz`;

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your dating app bill</h2>

        <div className="mb-6">
          <label className="text-white/50 text-sm block mb-2">Which app do you use most?</label>
          <div className="grid gap-2">
            {PLANS.map((p, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  i === selected
                    ? "border-white/30 bg-white/[0.06] text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/20"
                }`}
              >
                {p.name} {p.price > 0 ? `— $${p.price}/mo` : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="text-white/50 text-sm block mb-2">How long have you been using it?</label>
          <div className="flex items-center gap-4">
            <input type="range" min={1} max={60} value={months} onChange={(e) => setMonths(parseInt(e.target.value))}
              className="flex-1 accent-white" />
            <span className="text-white font-mono text-lg w-16 text-right">{months}mo</span>
          </div>
        </div>

        <div className="text-center p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
          {PLANS[selected].price > 0 ? (
            <>
              <p className="text-white/40 text-sm mb-1">You've spent approximately</p>
              <p className="text-5xl font-black text-white">${cost}</p>
              <p className="text-white/30 text-sm mt-2">on dating apps in {months} months</p>
              <div className="mt-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                <p className="text-green-400/80 text-sm">With Embir, you'd have saved <strong className="text-green-400">${savings}</strong></p>
              </div>
            </>
          ) : (
            <>
              <p className="text-5xl font-black text-green-400">$0</p>
              <p className="text-white/40 text-sm mt-2">You're already free. Welcome home.</p>
              <p className="text-white/30 text-xs mt-4">Tell your friends about the only truly free option.</p>
            </>
          )}
        </div>

        <button onClick={() => { setShared(true); window.open(shareUrl, '_blank'); }}
          className="w-full rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black hover:opacity-90 transition-all">
          {shared ? "Shared! Share again →" : "Share on X"}
        </button>
      </div>

      <p className="text-white/30 text-xs text-center">
        Embir is 100% free. No ads, no limits, no catch.{" "}
        <a href="/auth/register" className="text-white/50 hover:text-white/70 underline">Join now</a>
      </p>
    </div>
  );
}
