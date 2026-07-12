import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Test — What Kind of Guy Are You Looking For?",
  description: "Take our quick gay dating personality quiz. Discover your dating style, what you're really looking for, and get matched with compatible guys.",
  alternates: { canonical: "https://embir.xyz/test-gay" },
};

const questions = [
  {
    q: "What's your ideal first date?",
    options: ["Coffee and a walk", "Dinner and deep conversation", "Drinks and dancing", "Something spontaneous — surprise me"],
  },
  {
    q: "What matters most in a guy?",
    options: ["Sense of humor", "Emotional intelligence", "Physical chemistry", "Shared interests and values"],
  },
  {
    q: "What's your dating goal right now?",
    options: ["Serious relationship", "Open to anything", "Friends first, see where it goes", "Casual fun"],
  },
  {
    q: "How do you feel about PDA?",
    options: ["Love it — be proud", "Comfortable in safe spaces", "Prefer private moments", "Depends on the vibe"],
  },
];

export default function TestGayPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
            What kind of guy are you looking for?
          </h1>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">
            No algorithm can tell you who to love. But knowing what you want is the
            first step to finding it. Answer a few questions — honestly — and start
            matching with guys on the same wavelength.
          </p>

          <div className="space-y-6 mb-10">
            {questions.map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="text-white font-semibold text-lg mb-4">
                  {i + 1}. {item.q}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((opt, j) => (
                    <button
                      key={j}
                      className="text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/60 text-sm hover:border-white/20 hover:text-white transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Honesty is the best filter</h2>
            <p className="text-white/50 mb-6">
              The right person isn&apos;t looking for someone who checks every box.
              They&apos;re looking for someone real. Create your profile and let who you
              are do the work.
            </p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my profile
            </Link>
          </div>

          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Why knowing yourself matters</h2>
            <p>
              Dating apps often reduce compatibility to a swipe. Embir takes a different approach —
              we believe the best matches come from self-awareness. When you know what you want
              and what you bring, the right guys naturally gravitate toward you.
            </p>
            <h3 className="text-white/80 text-lg font-semibold">No wrong answers</h3>
            <p>Looking for a husband? Cool. Just got out of something and want to explore? Also cool. There are no wrong answers — only honest ones.</p>
            <h3 className="text-white/80 text-lg font-semibold">Matching that feels human</h3>
            <p>Embir applies declared preferences in both directions. The goal isn't more profiles — it's more relevant ones.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
