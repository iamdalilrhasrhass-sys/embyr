import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "First Gay Date — Tips for a Great First Meeting | Embir Blog",
  description: "Nervous about your first gay date? Practical tips to make it natural, fun, and memorable.",
  keywords: ["first gay date", "gay first date tips", "gay date advice", "what to do on a gay date", "successful gay date"],
  alternates: { canonical: "https://embir.xyz/blog/premier-date-gay-conseils" },
  openGraph: {
    title: "First Gay Date — Tips for a Great First Meeting | Embir Blog",
    description: "Nervous about your first gay date? Practical tips to make it natural, fun, and memorable.",
    url: "https://embir.xyz/blog/premier-date-gay-conseils",
    type: "article", siteName: "Embir", locale: "en_US",
  },
};

export default function ArticlePage() {
  return (
    <main className="emb-page min-h-screen">
      <article className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <Link href="/blog" className="text-white/40 hover:text-white/70 text-sm mb-8 inline-block transition-colors">← Blog</Link>
          <h1 className="text-3xl md:text-4xl font-black mb-6 text-white">First Gay Date: A Practical Guide</h1>
          <p className="text-white/50 text-sm mb-8">Published May 12, 2026 · 6 min read</p>
          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed space-y-6">
            <p>
              Congratulations — you've matched, chatted, and now you're meeting in person. A first gay date can be exciting, nerve-wracking, and confusing all at once. Here's how to make it a good one, regardless of whether there's a second.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Before the date</h2>
            <p><strong>Choose the right venue.</strong> Coffee or drinks — low pressure, easy to extend or cut short. A quiet spot where you can actually talk. Avoid restaurants (too committal for a first meeting) or loud bars (impossible to connect).</p>
            <p><strong>Confirm the day of.</strong> A quick "still on for tonight?" avoids no-shows and shows you're reliable.</p>
            <p><strong>Keep pre-date texting minimal.</strong> Save the good conversation for in person. You don't want to run out of material before the first sip of coffee.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">During the date</h2>
            <p><strong>Ditch the agenda.</strong> Don't go in with a list of questions or expectations. Let the conversation flow naturally. The best dates feel like hanging out with someone you already know.</p>
            <p><strong>Listen more than you talk.</strong> Ask follow-up questions. Show genuine curiosity. People remember how you made them feel, not what you said.</p>
            <p><strong>Be honest about the vibe.</strong> If you're feeling it, show it. If you're not, still be polite. You can end a date gracefully without saying "I don't feel a connection" — a simple "It was great meeting you" works.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">When to end it</h2>
            <p>Trust your gut after one drink or coffee. If the conversation flows and time flies, suggest extending. If you're checking your watch, it's time to go. A 45-minute good date is better than a 2-hour awkward one.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">After the date</h2>
            <p><strong>Send a text when you're home.</strong> A simple "Got back safe, really enjoyed tonight" is classy. It shows you're thinking of them and closes the loop.</p>
            <p><strong>Be honest about next steps.</strong> If you want another date, say so. "I'd love to do this again" beats waiting 48 hours to seem cool. If you don't, a "Thanks for a lovely evening, wish you the best" is still kind.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">What not to do</h2>
            <p>Don't talk about your ex. Don't check your phone. Don't order the messiest dish on the menu. Don't drink too much. Don't pretend to like things you don't. Don't stay if you're not feeling it out of politeness.</p>
            <p>And remember: the goal of a first date is not a second date. The goal is to find out if you want one. That shift in perspective takes all the pressure off.</p>
          </div>
          <div className="mt-12 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-white/70 mb-4">Ready for your next first date?</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all">Find guys near you</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
