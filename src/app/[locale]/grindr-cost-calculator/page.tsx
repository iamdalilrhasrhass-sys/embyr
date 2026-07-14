"use client";
import { useState } from "react";
import Link from "next/link";
const PLANS = [
  "Grindr",
  "Tinder",
  "Scruff",
  "Another subscription",
  "None — I’m done paying",
];

export default function GrindrCostCalculator() {
  const [months, setMonths] = useState(12);
  const [selected, setSelected] = useState(0);
  const [monthlyCost, setMonthlyCost] = useState(20);
  const [shared, setShared] = useState(false);

  const isPaying = selected !== PLANS.length - 1;
  const cost = (months * (isPaying ? monthlyCost : 0)).toFixed(0);

  const shareText = encodeURIComponent(
    `I calculated $${cost} in dating-app subscriptions over ${months} months. I’m trying @embir_app for its free core connections.`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=https://embir.xyz`;

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your dating app bill</h2>

        <div className="mb-6">
          <label className="text-white/50 text-sm block mb-2">Which app do you use most?</label>
          <div className="grid gap-2">
            {PLANS.map((plan, index) => (
              <button key={plan} onClick={() => setSelected(index)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  index === selected
                    ? "border-white/30 bg-white/[0.06] text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/20"
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>

        {isPaying ? (
          <div className="mb-6">
            <label htmlFor="monthly-cost" className="text-white/50 text-sm block mb-2">What do you actually pay per month?</label>
            <div className="flex items-center gap-3">
              <span className="text-white/45">$</span>
              <input id="monthly-cost" type="number" min={0} max={1000} step="0.01" value={monthlyCost} onChange={(event) => setMonthlyCost(Math.max(0, Number(event.target.value) || 0))} className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white" />
            </div>
          </div>
        ) : null}

        <div className="mb-8">
          <label className="text-white/50 text-sm block mb-2">How long have you been using it?</label>
          <div className="flex items-center gap-4">
            <input type="range" min={1} max={60} value={months} onChange={(e) => setMonths(parseInt(e.target.value))}
              className="flex-1 accent-white" />
            <span className="text-white font-mono text-lg w-16 text-right">{months}mo</span>
          </div>
        </div>

        <div className="text-center p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
          {isPaying ? (
            <>
              <p className="text-white/40 text-sm mb-1">You&apos;ve spent approximately</p>
              <p className="text-5xl font-black text-white">${cost}</p>
              <p className="text-white/30 text-sm mt-2">on dating apps in {months} months</p>
              <div className="mt-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                <p className="text-green-400/80 text-sm">This estimate uses the monthly amount you entered, not a third-party price claim.</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-5xl font-black text-green-400">$0</p>
              <p className="text-white/40 text-sm mt-2">You&apos;re already free. Welcome home.</p>
              <p className="text-white/30 text-xs mt-4">Tell your friends about Embir’s free core-connection experience.</p>
            </>
          )}
        </div>

        <button onClick={() => { setShared(true); window.open(shareUrl, '_blank'); }}
          className="w-full rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black hover:opacity-90 transition-all">
          {shared ? "Shared! Share again →" : "Share on X"}
        </button>
      </div>

      <p className="text-white/30 text-xs text-center">
        Everything needed to meet someone is free. No credit card required. Create a profile, discover compatible people and message reciprocal connections.{" "}
        <Link href="/auth/register" className="text-white/50 hover:text-white/70 underline">Join now</Link>
      </p>
    </div>
  );
}
