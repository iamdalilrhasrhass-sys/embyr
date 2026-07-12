import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LGBTQ+ Dating App — Safe, Inclusive, Verified | Embir",
  description: "Embir is built for LGBTQ+ dating with orientation-aware visibility, verified profiles, preference filters, reporting and blocking and free core connections.",
  alternates: {
    canonical: "https://embir.xyz/lgbtq-dating-app",
    languages: { "fr": "https://embir.xyz/fr/rencontre-lgbt" },
  },
  openGraph: {
    title: "LGBTQ+ Dating App — Safe, Inclusive, Verified | Embir",
    description: "Embir is built for LGBTQ+ dating with orientation-aware visibility, verified profiles, preference filters, reporting and blocking and free core connections.",
    url: "https://embir.xyz/lgbtq-dating-app",
    locale: "en_US",
    siteName: "Embir",
    images: [{ url: `/api/og?title=LGBTQ++Dating+App+—+Safe,+Inclusive,+Verified+%7C+Embir&variant=default`, width: 1200, height: 630, alt: "Embir LGBTQ+ dating" }],
  },
  twitter: { card: "summary_large_image", title: "LGBTQ+ Dating App — Safe, Inclusive, Verified | Embir", description: "Embir is built for LGBTQ+ dating with orientation-aware visibility, verified profiles, preference filters, reporting and blocking and free core connections.", images: [`/api/og?title=LGBTQ++Dating+App+—+Safe,+Inclusive,+Verified+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Community</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">LGBTQ+ dating built on respect, not stereotypes</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Most dating apps treat LGBTQ+ users as an afterthought — a checkbox, a filter, or a separate section. Embir was built from the ground up to serve every orientation equally: gay, lesbian, bisexual, trans, queer, and anyone still exploring their identity.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Orientation-aware visibility</h2>
            <p className="mt-4">This is the core of how Embir protects LGBTQ+ users. You declare your orientation and who you want to see. Your profile is only visible to people whose preferences are compatible. A lesbian woman sees women interested in women. A gay man sees men interested in men. A bi person chooses who sees them. A trans person controls their visibility completely.</p>
            <p className="mt-3">This isn&apos;t segregation — it&apos;s protection. It means fewer unwanted messages, fewer awkward explanations, and more relevant connections from the start.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Why Embir for LGBTQ+ dating</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Safety by design", "Orientation visibility controls, verified profiles, reporting and blocking, and instant blocking. Your safety isn't a feature — it's the foundation."],
                ["No fetishization", "We moderate against fetishizing behavior. Being trans or bi isn't a 'category' to browse — it's who you are."],
                ["All identities welcome", "Gay, lesbian, bi, trans, queer, non-binary, questioning, and anyone who doesn't fit a label. You define yourself."],
                ["Verified community", "Selfie verification reduces fake profiles and catfishing. LGBTQ+ users are disproportionately targeted by fake accounts — verification helps."],
                ["free for core connections", "No paywall to message or match. Test the full experience. Founding members shape the community while helping shape the product."],
                ["reporting and blocking", "Reports of homophobia, transphobia, or harassment are reviewed by real people, not algorithms. Serious violations = immediate ban."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">How we handle safety for LGBTQ+ users</h2>
            <p className="mt-4">LGBTQ+ dating comes with unique safety concerns. Embir addresses them with multiple layers: orientation-based visibility controls (you choose who sees your profile), selfie verification (fewer fake accounts targeting LGBTQ+ users), reporting and blocking (real people reviewing reports of harassment or hate speech), and instant blocking with no appeals for offenders.</p>
            <p className="mt-3">We know no platform can eliminate all risk. But we can make it much harder for bad actors to operate and much easier for you to control your experience.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Is Embir only for LGBTQ+ people?", "No. Embir is for everyone — straight, LGBTQ+, and anyone in between. The key difference is that orientation controls ensure everyone only sees compatible profiles, so straight users and LGBTQ+ users share the same platform without unwanted overlap."],
                ["How does Embir protect trans users?", "Trans users set their gender identity and visibility preferences. They choose who can see their profile. Harassment or misgendering is a violation of our community rules and leads to immediate moderation action."],
                ["Is Embir better than Grindr for LGBTQ+ dating?", "It depends on what you want. Grindr optimizes for immediate proximity. Embir optimizes for compatibility, verified profiles, and clearer intentions — across all orientations, not just gay men."],
                ["Can I hide my orientation on my profile?", "Your orientation settings control visibility. You can choose to only be visible to compatible people. Other users do not see your orientation label unless you choose to display it."],
                ["What about bisexual and pansexual visibility?", "Bi and pan users can set their preferences to see and be seen by multiple genders. You control who sees your profile based on their orientation and gender, not based on assumptions about yours."],
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
          <h2 className="font-serif text-3xl text-white">Join a platform that respects who you are</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free profile. Set your orientation and preferences. Meet people who are actually compatible — in a community that takes your safety seriously.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/verified-dating-app", "Verified dating"],
              ["/safety", "Safety tools"],
              ["/moderation", "Moderation"],
              ["/grindr-alternative", "Grindr alternative"],
              ["/tinder-alternative", "Tinder alternative"],
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
