import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating Los Angeles — Free Gay App | Embyr",
  description: "Gay dating in Los Angeles on Embyr. 100% free app, no ads, no premium. Create your profile and meet guys near you in Los Angeles.",
  keywords: ["gay dating Los Angeles", "gay Los Angeles", "meet guys Los Angeles", "gay app Los Angeles", "dating gay Los Angeles", "free gay dating"],
  alternates: { canonical: "https://embir.xyz/rencontre-gay/los-angeles" },
};

export default function GayDatingCity() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Gay Dating in <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">Los Angeles</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Looking to meet guys in Los Angeles? Embyr is the 100% free gay dating app. 
            No ads, no premium, no catch. Create your profile and start connecting with men near you in Los Angeles.
          </p>
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-white font-bold">100% Free</div>
              <div className="text-white/40 text-sm mt-1">No hidden costs</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">📍</div>
              <div className="text-white font-bold">Local</div>
              <div className="text-white/40 text-sm mt-1">Guys in Los Angeles</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-white font-bold">25 Languages</div>
              <div className="text-white/40 text-sm mt-1">Talk in your language</div>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to meet guys in Los Angeles?</h2>
            <p className="text-white/50 mb-6">Join 4M people in Los Angeles already discovering Embyr.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40 hover:scale-[1.02]">
              Create my free profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
