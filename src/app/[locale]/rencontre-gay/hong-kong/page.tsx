import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating in Hong Kong — 100% Free App | Embir",
  description: "Gay dating in Hong Kong on Embir. 100% free app with no ads. Create your profile and meet guys near you in Hong Kong.",
  keywords: ["gay dating Hong Kong", "gay Hong Kong", "meet guys Hong Kong", "gay app Hong Kong", "LGBTQ Hong Kong"],
  alternates: { canonical: "https://embir.xyz/rencontre-gay/hong-kong" },
};

export default function RencontreGayCityPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Gay dating in <span className="text-white/70">Hong Kong</span>
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Looking to meet men in Hong Kong? Embir is the 100% free gay dating app.
            Create your profile in 2 minutes and discover guys near you.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Free</div>
              <div className="text-white/40 text-sm">No ads, no hidden fees</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Local</div>
              <div className="text-white/40 text-sm">Guys near Hong Kong</div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-white/90 font-bold text-lg mb-1">Private</div>
              <div className="text-white/40 text-sm">Discreet mode available</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to meet guys in Hong Kong?</h2>
            <p className="text-white/50 mb-6">Join the Hong Kong launch and help Embir build its first local community.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>

          <div className="prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">Why choose Embir for gay dating in Hong Kong?</h2>
            <p>
              Embir is built for men seeking authentic connections in Hong Kong.
              No intrusive algorithms. No aggressive ads. No hidden premium subscriptions.
              Just guys, near you, ready to talk.
            </p>
            <h3 className="text-white/80 text-lg font-semibold">Quick signup</h3>
            <p>2 minutes is all it takes. Email, password, and you&apos;re in. No endless questionnaire.</p>
            <h3 className="text-white/80 text-lg font-semibold">Unlimited messaging</h3>
            <p>Talk to whoever you want, whenever you want. No message limits. No paywalls.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
