import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Dating App for the US — New York, LA, Miami & More | Embir",
  description: "Embir is free at launch in the United States. Verified profiles, orientation-aware discovery, compatibility matching, and a founding community — built city by city.",
  alternates: {
    canonical: "https://embir.xyz/us",
    languages: { "fr": "https://embir.xyz/fr/etats-unis" },
  },
  openGraph: {
    title: "Free Dating App for the US — New York, LA, Miami & More | Embir",
    description: "Embir is free at launch in the United States. Verified profiles, orientation-aware discovery, compatibility matching, and a founding community.",
    url: "https://embir.xyz/us",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Free+Dating+App+for+the+US+—+New+York,+LA,+Miami+&+More+%7C+Embir&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Free Dating App for the US | Embir", description: "Embir is free at launch in the US. Verified profiles and compatibility matching.", images: [`/api/og?title=Free+Dating+App+for+the+US+—+New+York,+LA,+Miami+&+More+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">United States</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Dating in the US, rebuilt for compatibility</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          The US has no shortage of dating apps — Tinder, Bumble, Hinge, Grindr. But for many Americans, the experience has become exhausting: endless swiping, fake profiles, and conversations that go nowhere. Embir takes a different approach, starting with founding communities in New York, Los Angeles, and Miami.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">City by city, not nationwide hype</h2>
            <p className="mt-4">Embir is not promising a massive nationwide launch. We&apos;re building density city by city, starting with locations where founding members can create real local networks. New York&apos;s density and diversity make it an ideal first US market. Los Angeles, with its spread-out geography and lifestyle-driven dating scene, tests how well compatibility works when distance is a real factor. Miami brings a bilingual, multicultural dynamic that helps us build for diverse communities.</p>
            <p className="mt-3">This deliberate approach means the US community will start smaller but more genuine — verified profiles, clear intentions, and real local members rather than inflated numbers.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Why the US needs a different kind of dating app</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Dating app fatigue is real", "A 2024 Pew study found that nearly half of Americans who've used dating apps describe the experience as frustrating. The swipe model optimizes for engagement, not connection. Embir focuses on compatibility signals — shared interests, intentions, preferences — so you spend less time swiping and more time on promising conversations."],
                ["Fake profiles waste everyone's time", "Catfishing and bot accounts are rampant on major US dating apps. Embir's selfie verification creates a real barrier against fake profiles. Verified profiles tend to have more genuine interactions because other members trust they're talking to a real person."],
                ["Orientation-aware for everyone", "The US has one of the most diverse dating populations in the world. Embir doesn't put LGBTQ+ users in a separate section or treat them as an afterthought. Everyone uses the same platform, but orientation controls ensure you only see compatible profiles — whether you're straight, gay, lesbian, bi, trans, or queer."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">How Embir compares for US daters</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {[
                ["Tinder", "Swipe on photos, massive volume", "Focus on compatibility, verified profiles, clearer intentions"],
                ["Bumble", "Women message first, time-limited matches", "Orientation-aware visibility, no time pressure, all genders initiate equally"],
                ["Hinge", "Designed to be deleted, prompts", "Personal universe profiles, compatibility signals, community-first approach"],
                ["Grindr", "Gay/bi men, distance-first grid", "All orientations, compatibility over proximity, verified profiles"],
              ].map(([app, them, us]) => (
                <div key={app} className="grid grid-cols-[120px_1fr_1fr] border-b border-white/[0.04] px-5 py-4 text-sm last:border-b-0">
                  <div className="font-semibold text-white/70">{app}</div>
                  <div className="text-white/30">{them}</div>
                  <div className="text-[#d4a574]">{us}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Is Embir available everywhere in the US?", "Embir is building density city by city, starting with New York, Los Angeles, and Miami. The platform is accessible from anywhere in the US, but the founding community is concentrated in these initial cities."],
                ["Is Embir free in the US?", "Yes, completely free during the launch phase. Messaging, matching, verification — all included for founding members. A freemium model will be introduced later to fund the mobile app."],
                ["How is Embir different from Hinge or Bumble?", "Embir focuses on orientation-aware visibility and compatibility signals rather than the swipe mechanic. It also serves all orientations on a single platform with preference-based visibility controls."],
                ["When is the mobile app launching in the US?", "The mobile app is in development. The web version works on mobile browsers. Founding members will be notified first when the native apps are ready."],
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
          <h2 className="font-serif text-3xl text-white">Join the US founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free verified profile and be part of building a healthier dating culture in the US.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/uk", "UK dating"],
              ["/switzerland", "Switzerland dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
              ["/tinder-alternative", "Tinder alternative"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
