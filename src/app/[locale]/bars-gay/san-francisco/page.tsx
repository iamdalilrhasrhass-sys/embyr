import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Gay Bars in San Francisco — Guide & Map",
  description: "Discover the best gay bars in San Francisco with Embir's curated guide. Find LGBTQ-friendly spots, meet locals, and explore the scene.",
  alternates: { canonical: "https://embir.xyz/bars-gay/san-francisco" },
};

export default function BarsGayCityPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Best gay bars in <span className="text-white/70">San Francisco</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Explore San Francisco&apos;s LGBTQ nightlife. From cozy neighborhood pubs to vibrant dance clubs, 
            find the spots where the local community comes together.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Curated</div>
              <div className="text-white/40 text-sm">Hand-picked local spots</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Updated</div>
              <div className="text-white/40 text-sm">Current hours and vibes</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Connected</div>
              <div className="text-white/40 text-sm">Meet guys who go there</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Meet guys who love San Francisco&apos;s nightlife</h2>
            <p className="text-white/50 mb-6">Join Embir and connect with locals who know the best spots.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>

          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Navigating the gay scene in San Francisco</h2>
            <p>
              San Francisco has a rich LGBTQ nightlife. Whether you&apos;re into relaxed wine bars, 
              high-energy dance floors, or drag shows, there&apos;s a place for every vibe.
              Embir connects you with guys who actually go to these places — not just tourists.
            </p>
            <h3 className="text-white/80 text-lg font-semibold">Local favorites</h3>
            <p>Discover the bars locals actually recommend, not just the ones with the highest Google rating.</p>
            <h3 className="text-white/80 text-lg font-semibold">Go together</h3>
            <p>Match with someone and suggest meeting at a bar you both want to try. First dates feel easier with a plan.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
