import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grindr Alternative — More Compatibility, Less Noise | Embir",
  description: "Looking for a Grindr alternative? Embir offers verified profiles, compatibility matching, clearer intentions, and free core connections — for all orientations, not just gay men.",
  alternates: {
    canonical: "https://embir.xyz/grindr-alternative",
    languages: { "fr": "https://embir.xyz/fr/alternative-grindr" },
  },
  openGraph: {
    title: "Grindr Alternative — More Compatibility, Less Noise | Embir",
    description: "Looking for a Grindr alternative? Embir offers verified profiles, compatibility matching, clearer intentions, and free core connections — for all orientations, not just gay men.",
    url: "https://embir.xyz/grindr-alternative",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Grindr+Alternative+—+More+Compatibility,+Less+Noise+%7C+Embir&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Grindr Alternative — More Compatibility, Less Noise | Embir", description: "Looking for a Grindr alternative? Embir offers verified profiles, compatibility matching, clearer intentions.", images: [`/api/og?title=Grindr+Alternative+—+More+Compatibility,+Less+Noise+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Comparison</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">A Grindr alternative for when you want more than proximity</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Grindr changed gay dating forever. But for many, the constant stream of nearby profiles, the pressure to meet instantly, and the limited focus on compatibility have become exhausting. Embir offers a different rhythm — still for gay and bi men, but also for everyone else.
        </p>

        <section className="mt-10 space-y-5 text-base leading-relaxed text-white/55">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <h2 className="p-5 font-serif text-2xl text-white border-b border-white/[0.04]">How Embir compares</h2>
            {[
              ["Core access", "Free with paid tiers", "free for core connections"],
              ["Core audience", "Gay, bi, trans, queer men", "All orientations (gay, lesbian, bi, trans, queer, straight)"],
              ["Discovery method", "Distance-first grid", "Preferences and compatibility first"],
              ["Profile depth", "Photos + short bio", "Personal universe with interests, intentions, preferences"],
              ["Verification", "Optional photo verification", "Selfie verification to reduce fake profiles"],
              ["Safety tools", "Blocking and reporting", "Blocking, reporting, reporting and blocking, orientation visibility controls"],
              ["Future model", "Subscription tiers (Xtra, Unlimited)", "Transparent freemium to fund mobile app and safety"],
            ].map(([feature, grindr, embir]) => (
              <div key={feature} className="grid grid-cols-3 border-b border-white/[0.04] px-5 py-4 text-sm last:border-b-0">
                <div className="text-white/60">{feature}</div>
                <div className="text-center text-white/30">{grindr}</div>
                <div className="text-center font-semibold text-[#d4a574]">{embir}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why people look for Grindr alternatives</h2>
            <p className="mt-4">We&apos;ve heard the same things from people exploring options: &quot;It&apos;s too focused on hookups,&quot; &quot;I want more than a torso pic,&quot; &quot;The free version is too limited,&quot; &quot;I want to know if we&apos;re actually compatible before meeting.&quot;</p>
            <p className="mt-3">These aren&apos;t criticisms of Grindr — they&apos;re signals that different people want different things from dating apps. Embir doesn&apos;t try to be a better Grindr. It tries to be a different kind of space: one where compatibility, safety and verified identity carry more weight than distance alone.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What Embir does differently</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Not just for gay men", "Embir welcomes everyone. Gay and bi men share the platform with lesbians, trans people, queer folks, and straight people — but orientation controls ensure you only see compatible profiles."],
                ["Verified, not anonymous", "Selfie verification means fewer blank profiles and catfish accounts. You know you're talking to a real person."],
                ["Intentions that matter", "Looking for a relationship? Open to casual? Just exploring? Your intentions are visible and filterable."],
                ["core connection features are free", "No subscription needed to message, match, or browse. The founding community tests everything while helping shape the product."],
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
                ["Is Embir trying to replace Grindr?", "No. Grindr serves a specific purpose well. Embir is for people who want a different experience: more compatibility context, verified profiles, and a platform that serves all orientations — not just gay men."],
                ["Can I use both Embir and Grindr?", "Of course. Many people use multiple dating apps for different purposes. Embir might be where you look for more meaningful connections while using other apps for different needs."],
                ["Is Embir free like Grindr?", "Embir's core connection features are free with no paywalls on core features. Optional services can fund safety, moderation and product development."],
                ["Does Embir have the same user base as Grindr?", "Embir is in its core connection experience, building its community city by city. The user base starts smaller but with verified profiles and clearer intentions — quality over quantity from day one."],
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
          <h2 className="font-serif text-3xl text-white">Try a different approach</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free verified profile and experience dating where compatibility comes before distance.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/tinder-alternative", "Tinder alternative"],
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
