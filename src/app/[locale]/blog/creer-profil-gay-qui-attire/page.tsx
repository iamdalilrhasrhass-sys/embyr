import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Create a Gay Dating Profile That Attracts | Embir Blog",
  description: "Photos, bio, what to say (and avoid) to create a profile that gets the right kind of attention.",
  keywords: ["gay dating profile tips", "create gay profile", "best gay dating profile", "gay profile bio ideas", "dating profile photo tips gay"],
  alternates: { canonical: "https://embir.xyz/blog/creer-profil-gay-qui-attire" },
  openGraph: {
    title: "How to Create a Gay Dating Profile That Attracts | Embir Blog",
    description: "Photos, bio, what to say (and avoid) to create a profile that gets the right kind of attention.",
    url: "https://embir.xyz/blog/creer-profil-gay-qui-attire",
    type: "article", siteName: "Embir", locale: "en_US",
  },
};

export default function ArticlePage() {
  return (
    <main className="emb-page min-h-screen">
      <article className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <Link href="/blog" className="text-white/40 hover:text-white/70 text-sm mb-8 inline-block transition-colors">← Blog</Link>
          <h1 className="text-3xl md:text-4xl font-black mb-6 text-white">How to Create a Gay Dating Profile That Works</h1>
          <p className="text-white/50 text-sm mb-8">Published May 18, 2026 · 6 min read</p>
          <div className="prose prose-invert max-w-none text-white/60 leading-relaxed space-y-6">
            <p>
              Your dating profile is your first impression. In a split second, someone decides if they want to know more or swipe past. Here's how to make that split second count — without selling a fake version of yourself.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Photos: the rules</h2>
            <p><strong>Use 3-5 clear photos.</strong> One selfie, one full-body shot, one doing something you love. Multiple photos give a fuller picture and show you're a real person.</p>
            <p><strong>No group shots as your main.</strong> I shouldn't have to guess which one is you. A group photo lower in your gallery is fine to show you have friends. But your main photo? Just you.</p>
            <p><strong>No sunglasses obscuring your face.</strong> I need to see your eyes. It builds trust. Same goes for blurry or heavily filtered photos.</p>
            <p><strong>Recent photos only.</strong> Within the last year. If you look different in person, the date starts with disappointment. Be the person they expected.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">Bio: write like a human</h2>
            <p><strong>Start with who you are, not what you want.</strong> "Coffee enthusiast, terrible dancer, good listener" is more engaging than "Looking for a serious relationship."</p>
            <p><strong>Be specific.</strong> "I go on long walks" is boring. "I know the best hidden coffee spots in Brooklyn" is a conversation starter. Specifics make you memorable.</p>
            <p><strong>Keep it positive.</strong> "Swiped left if" lists come across as negative. Focus on what you enjoy rather than what frustrates you.</p>
            <p><strong>Include a conversation hook.</strong> End with a question or an invitation to message about something specific. "Tell me your best travel story" gives them an easy opener.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">What to avoid</h2>
            <p><strong>Negativity.</strong> "No drama" implies you bring drama. "Just ask" means you couldn't be bothered. "Figure it out as we go" is a missed opportunity.</p>
            <p><strong>Generic statements.</strong> "I like having fun" — who doesn't? Show, don't tell.</p>
            <p><strong>Over-sharing.</strong> Your life story, your last breakup, your entire personality type — save that for the actual date. The profile is a teaser, not the movie.</p>
            <p><strong>Lies.</strong> Age, height, photos from five years ago, "active" when you haven't opened the app in months. Every lie creates a first date that starts with disappointment.</p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4">The golden rule</h2>
            <p>
              Create a profile that makes it easy for the right person to message you. Be specific enough that someone can comment on something real. A profile that filters out the wrong people is more valuable than one that attracts everyone.
            </p>
            <p>
              For more tips, check out <Link href="/blog/comment-draguer-mec-guide-complet" className="text-white/80 hover:text-white underline">how to flirt with a guy</Link>.
            </p>
          </div>
          <div className="mt-12 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-white/70 mb-4">Create your profile on a <strong className="text-white">100% free</strong> app.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all">Create my profile</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
