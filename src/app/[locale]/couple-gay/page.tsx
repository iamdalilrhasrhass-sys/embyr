import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Couples — Find Your Match | Embir",
  description: "Find your gay partner on Embir. 100% free dating app for men seeking relationships.",
  alternates: { canonical: "https://embir.xyz/couple-gay" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">Gay Couples</h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">Find your gay partner on Embir. 100% free dating app for men seeking relationships.</p>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to find your match?</h2>
            <p className="text-white/50 mb-6">Join Embir now. 100% free, real connections.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>
          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Why Embir?</h2>
            <p>Unlike other gay dating apps, Embir is 100% free. Unlimited messaging, full profiles, discover guys near you — everything included, no exceptions.</p>
            <h3 className="text-white/80 text-lg font-semibold">Truly free</h3>
            <p>No hidden subscriptions, no freemium that blocks you after 3 messages. Embir is free for everyone, always.</p>
            <h3 className="text-white/80 text-lg font-semibold">25 languages</h3>
            <p>Talk to guys worldwide. Automatic translation is built into the messaging.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
