import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tinder Alternative — Less Swiping, More Compatibility | Embir",
  description: "Tired of swipe fatigue? Embir is a Tinder alternative built on compatibility, verified profiles, clear intentions, and a free launch for all orientations.",
  alternates: {
    canonical: "https://embir.xyz/tinder-alternative",
    languages: { "fr": "https://embir.xyz/fr/alternative-tinder" },
  },
  openGraph: {
    title: "Tinder Alternative — Less Swiping, More Compatibility | Embir",
    description: "Tired of swipe fatigue? Embir is a Tinder alternative built on compatibility, verified profiles, clear intentions, and a free launch for all orientations.",
    url: "https://embir.xyz/tinder-alternative",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Tinder+Alternative+—+Less+Swiping,+More+Compatibility+%7C+Embir&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Tinder Alternative — Less Swiping, More Compatibility | Embir", description: "Tired of swipe fatigue? Embir is a Tinder alternative built on compatibility and verified profiles.", images: [`/api/og?title=Tinder+Alternative+—+Less+Swiping,+More+Compatibility+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Comparison</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">A Tinder alternative for people tired of endless swiping</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Tinder made dating apps mainstream. But for many, the swipe-tap-repeat cycle has become more draining than exciting. Embir takes a different approach: fewer random matches, more compatible connections.
        </p>

        <section className="mt-10 space-y-5 text-base leading-relaxed text-white/55">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <h2 className="p-5 font-serif text-2xl text-white border-b border-white/[0.04]">How Embir compares</h2>
            {[
              ["Launch price", "Free with Tinder Plus/Gold/Platinum", "Free during launch phase"],
              ["Discovery method", "Swipe on photos", "Preferences, compatibility, and intentions first"],
              ["Profile depth", "Photos + short bio", "Personal universe with interests, intentions, preferences"],
              ["Audience", "Primarily straight, some LGBTQ+", "All orientations with orientation-aware visibility"],
              ["Verification", "Photo verification available", "Selfie verification encouraged"],
              ["Paywall timing", "Limited likes on free tier", "No core feature paywalls during launch"],
              ["Future model", "Subscription tiers", "Transparent freemium for mobile app and safety"],
            ].map(([feature, tinder, embir]) => (
              <div key={feature} className="grid grid-cols-3 border-b border-white/[0.04] px-5 py-4 text-sm last:border-b-0">
                <div className="text-white/60">{feature}</div>
                <div className="text-center text-white/30">{tinder}</div>
                <div className="text-center font-semibold text-[#d4a574]">{embir}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">The swipe fatigue problem</h2>
            <p className="mt-4">Swiping was fun when it was new. But after hundreds of left swipes, dozens of matches that never message, and conversations that fizzle after &quot;hey,&quot; the experience loses its appeal. Tinder optimizes for volume — more profiles, more swipes, more time in the app. Embir optimizes for compatibility — fewer but better connections, with more context before you even say hello.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What Embir does differently</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Compatibility over volume", "Instead of showing you hundreds of profiles to swipe through, Embir uses your preferences, intentions, and interests to suggest people you're more likely to actually connect with."],
                ["Intentions are clear", "Looking for a relationship? Casual dating? Not sure yet? Your intentions are visible on your profile. Filter out people who want different things."],
                ["Verified profiles", "Selfie verification reduces fake accounts, bots, and catfish. Fewer 'is this person real?' moments before a date."],
                ["All orientations, one platform", "Embir doesn't separate people by orientation. Everyone uses the same app, but orientation controls ensure you only see compatible profiles."],
                ["Free at launch", "No limited likes, no paywall on messaging. Test the full experience. Founding members get to shape the community before any premium features exist."],
                ["Safer by design", "Reporting, blocking, human moderation, and orientation visibility controls are built in, not bolted on."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Is Embir better than Tinder?", "It depends on what you want. If you enjoy the swipe mechanic and want maximum volume, Tinder works well. If you want more context before matching, verified profiles, clearer intentions, and a free-at-launch model, Embir might be a better fit."],
                ["Can I use both Embir and Tinder?", "Absolutely. Many people use multiple apps. Embir is free during launch, so there's no cost to trying both and seeing which works better for you."],
                ["Does Embir have a swipe feature?", "Embir is designed around profile exploration and compatibility signals rather than binary swiping. You browse profiles, read about people's interests and intentions, and connect when you find real compatibility."],
                ["Why is Embir free at launch?", "We want to build a quality founding community before introducing any paid features. The first members help establish the culture and give feedback that shapes the platform. A future freemium model will fund the mobile app, safety tools, and moderation."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Ready for fewer swipes and better connections?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free profile and experience dating where compatibility matters more than volume.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/grindr-alternative", "Grindr alternative"],
              ["/lgbtq-dating-app", "LGBTQ dating app"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
              ["/safety", "Safety tools"],
              ["/about", "About Embir"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
