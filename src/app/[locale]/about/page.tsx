import EmbirLogo from "@/components/brand/EmbirLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — embir.xyz",
  description: "Discover embir.xyz, the free gay dating app starting with 100 founding members in Paris. No ads, no fake profiles, just real connections.",
};

const team = [
  { name: "Dalil R.", role: "Founder & CEO", desc: "Tech entrepreneur passionate about user experiences that actually change things." },
  { name: "DeepSeek", role: "Matching AI", desc: "Analyzes personalities for truly compatible matches." },
  { name: "You?", role: "Join the adventure", desc: "We're recruiting talent to build the best dating experience." },
];

const values = [
  { title: "Authenticity", desc: "No fake profiles to make the app look full. We prefer a small real community over a fake backdrop." },
  { title: "Local density", desc: "We start with Paris to create enough real profiles in one place before expanding." },
  { title: "Accessibility", desc: "100% free at launch. No ads, no swipe counters, no paywall for messages." },
  { title: "Respect", desc: "Zero tolerance for toxicity. Reporting, moderation, and an adult 18+ community." },
];

export default function AboutPage() {
  return (
    <main className="emb-page pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="text-center mb-24">
          <div className="mb-8 flex justify-center">
            <EmbirLogo size="lg" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-6">
            Dating,<br />
            <span className="text-white/70">
              rethought.
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            embir.xyz was born from a simple observation: a dating app is useless if it's empty,
            toxic, or filled with fake profiles. So we start small, local, and honest: Paris, 100 founding
            members, then we expand from there.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-24">
          <div className="relative p-8 sm:p-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6">Our mission</h2>
            <p className="text-white/50 leading-relaxed text-base sm:text-lg">
              Enable every gay, bi, or curious man to make authentic connections,
              with no financial barrier and no fake counters. We use technology to facilitate
              meeting, not to keep you stuck in an infinite swipe loop.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white/80">100%</div>
                <div className="text-xs text-white/30 mt-1">Free at launch</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/80">Paris</div>
                <div className="text-xs text-white/30 mt-1">First</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/80">7</div>
                <div className="text-xs text-white/30 mt-1">Matching AIs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/80">∞</div>
                <div className="text-xs text-white/30 mt-1">Free messages</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-10 text-center">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-10 text-center">Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center hover:border-white/10 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/[0.06] mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-serif text-white/60">{m.name[0]}</span>
                </div>
                <h3 className="text-white font-semibold">{m.name}</h3>
                <p className="text-xs text-white/40 mt-1 mb-3">{m.role}</p>
                <p className="text-sm text-white/30 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4">Ready to join us?</h2>
            <p className="text-white/40 mb-8 max-w-lg mx-auto">
              Join the first 100 founding members in Paris. One real profile is worth more than ten promises.
            </p>
            <a
              href="/paris"
              className="inline-block px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:opacity-90 transition-all"
            >
              Join the Paris founders
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
