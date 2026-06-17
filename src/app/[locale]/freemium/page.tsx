import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Freemium Model — Transparent, Fair & Coming Later | Embir",
  description: "Embir is free during launch. A transparent freemium model will fund the mobile app, safety, moderation and infrastructure — with no surprise paywalls.",
  alternates: {
    canonical: "https://embir.xyz/freemium",
    languages: { "fr": "https://embir.xyz/fr/modele-freemium" },
  },
  openGraph: {
    title: "Freemium Model — Transparent, Fair & Coming Later | Embir",
    description: "Embir is free during launch. A transparent freemium model will fund the mobile app, safety, moderation and infrastructure — with no surprise paywalls.",
    url: "https://embir.xyz/freemium",
    locale: "en_US",
    siteName: "Embir",
  },
  twitter: { card: "summary_large_image", title: "Freemium Model — Transparent, Fair & Coming Later | Embir", description: "Embir is free during launch. A transparent freemium model will fund the mobile app and safety.", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Business Model</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Our freemium model: honest about what&apos;s free, what won&apos;t be, and why</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Most dating apps hide their business model behind vague promises and sudden paywalls. Embir takes the opposite approach: here&apos;s exactly what&apos;s free now, what might become premium later, and why we&apos;ll eventually need revenue to keep the platform safe and sustainable.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Phase 1: Free at launch (now)</h2>
            <p className="mt-4">Embir is currently in its launch phase. Every core feature is free — no exceptions, no fine print. Founding members get unlimited access to profile creation, discovery, messaging, compatibility matching, orientation-based visibility, selfie verification, reporting, and blocking.</p>
            <p className="mt-3">Why? Because a dating platform needs a real community before it can ask anyone to pay. We need founding members to test the product, give feedback, report issues, and help establish the culture. Charging from day one would slow down community growth and exclude people before they&apos;ve even had a chance to see if Embir works for them.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What the future freemium funds</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Mobile app development", "Building native iOS and Android apps requires significant engineering resources. The web version works on mobile browsers, but native apps provide a better experience."],
                ["Human moderation", "Every report is reviewed by a real person. This costs money but is non-negotiable for community safety. Automated moderation alone isn't enough."],
                ["Infrastructure", "Servers, databases, image storage, and security monitoring all scale with the user base. A growing community needs growing infrastructure."],
                ["Safety & verification", "Selfie verification technology, anti-fraud systems, and safety tool development require ongoing investment."],
                ["Product improvement", "Continuous development of compatibility algorithms, preference systems, and user experience improvements."],
                ["Support team", "Real humans answering support tickets, handling account issues, and helping users who need assistance."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">What will always remain accessible</h2>
            <p className="mt-4">Core dating functionality will not be locked behind a paywall. Creating a profile, browsing compatible people, sending and receiving messages, setting orientation preferences, and using safety tools (reporting, blocking) will remain free. A dating app that charges you to have a basic conversation isn&apos;t a freemium model — it&apos;s a paywall. Embir won&apos;t do that.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What might become premium</h2>
            <p className="mt-4">Premium features — when they arrive — will be optional enhancements, not replacements for basic functionality. They could include: seeing who liked your profile before you match, advanced compatibility filters, profile boosts for temporary increased visibility, and read receipts for messages. None of these are essential to meeting people. They&apos;re nice-to-have extras that help fund the platform for everyone.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Our promise to founding members</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Advance notice", "We will announce any freemium changes well before they take effect. No overnight surprises."],
                ["Core features stay free", "What's free now for founding members will remain free. Premium features will be additions, not replacements."],
                ["No data monetization", "We will never sell your data. Our revenue model is freemium, not surveillance."],
                ["No intrusive ads", "The platform experience won't be disrupted by advertising. Premium features, not ad inventory, will fund Embir's future."],
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
                ["When exactly will the freemium model start?", "There is no fixed date. The launch phase will continue until the founding community is established and the mobile app is ready. All members will receive advance notice."],
                ["How much will premium features cost?", "Pricing hasn't been set yet. Our goal is to make premium affordable and clearly communicated — no confusing tier structures or hidden fees."],
                ["Can I stay on the free tier forever?", "Yes. The free tier will always include core features: profile, discovery, messaging, safety tools, and basic compatibility matching. Premium is optional."],
                ["Why not just stay free forever?", "Running a dating platform at scale costs real money: servers, moderation teams, engineers, safety infrastructure. A sustainable business model ensures Embir can exist for years, not months."],
                ["Will my data be sold to fund the platform?", "No. Embir's revenue comes from optional premium features, not from selling user data. We've committed to this from day one."],
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
          <h2 className="font-serif text-3xl text-white">Join while everything is free</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Become a founding member. Experience the full platform at no cost, and help shape its future before any premium features exist.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/free-dating-app", "Free dating app"],
              ["/verified-dating-app", "Verified dating"],
              ["/safety", "Safety tools"],
              ["/about", "About Embir"],
              ["/terms", "Terms of service"],
              ["/privacy", "Privacy policy"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
