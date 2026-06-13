import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Classifieds — Free Personal Ads | Embir",
  description: "Browse and post free gay classifieds on Embir. Find local personal ads, events, and connections.",
  alternates: { canonical: "https://embir.xyz/annonces" },
};

export default function AnnoncesPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">Gay Classifieds</h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Browse and post free personal ads. Find local events, connections, and more.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Free</div>
              <div className="text-white/40 text-sm">Post and browse at no cost</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Local</div>
              <div className="text-white/40 text-sm">Find ads near you</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Simple</div>
              <div className="text-white/40 text-sm">Post in seconds</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to connect?</h2>
            <p className="text-white/50 mb-6">Join Embir and start browsing classifieds from guys near you.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
