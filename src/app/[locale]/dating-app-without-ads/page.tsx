import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dating App Without Ads — Premium Experience, Free",
  description: "Tired of ads between every swipe? Embir is a dating app with absolutely no ads. Premium experience, completely free during launch.",
alternates: {
    canonical: "https://embir.xyz/dating-app-without-ads",
    languages: {
      "fr": "https://embir.xyz/rencontre-sans-pub",
    },
  },
  openGraph: {
    title: "Dating App Without Ads — Premium Experience, Free",
    description: "Tired of ads between every swipe? Embir is a dating app with absolutely no ads. Premium experience, completely free during launch.",
    url: "https://embir.xyz/dating-app-without-ads",
    locale: "en_US",
    siteName: "Embir",
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">No Ads</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">A dating app with zero ads. Seriously.</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">Tired of ads between every swipe? Embir is a dating app with absolutely no ads. Premium experience, completely free during launch.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2]">Create Free Profile</Link>
            <Link href="/" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Home</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-8">Why choose Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Verified Profiles</h3>
              <p className="text-sm text-white/45">Every member verifies their identity by selfie. No fake profiles, no bots, no disappointments.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">100% Free During Launch</h3>
              <p className="text-sm text-white/45">Unlimited messaging, AI matching, complete profiles. No subscription, no ads.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Smart AI Matching</h3>
              <p className="text-sm text-white/45">Our DeepSeek AI learns your preferences to suggest truly compatible profiles.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Privacy & Respect</h3>
              <p className="text-sm text-white/45">Your data is never sold. Zero intrusive ads. Human moderation.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Is Embir really free?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Yes. During the launch phase, all features are free — messaging, matching, profiles. Founding members keep premium access for life.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">How are profiles verified?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Each new member completes a real-time selfie verification. Our system compares the profile photo with a live selfie.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Where is Embir available?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir is available in France, the US, and the UK — with active communities in Paris, New York, London, and many more cities.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create Free Profile</Link>
        <p className="mt-4 text-xs text-white/20">18+ only. Free during launch. No commitment.</p>
      </section>
    </main>
  );
}