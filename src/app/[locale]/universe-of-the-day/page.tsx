import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface DailyProfile {
  username: string;
  displayName: string | null;
  age: number;
  city: string | null;
  country: string | null;
  description: string | null;
  isVerified: boolean;
  isFounder: boolean;
  genderIdentity: string | null;
  lookingFor: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Universe of the Day — Embir",
    description: "Discover today's featured universe on Embir. A new profile to explore every day.",
    alternates: { canonical: "https://embir.xyz/universe-of-the-day" },
    openGraph: {
      title: "Universe of the Day — Embir",
      description: "Discover today's featured universe on Embir.",
      url: "https://embir.xyz/universe-of-the-day",
      type: "website",
      images: [{ url: "/api/og?title=Universe%20of%20the%20Day&subtitle=Discover%20today%27s%20featured%20universe&variant=product", width: 1200, height: 630, alt: "Embir Universe of the Day" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Universe of the Day — Embir",
      description: "Discover today's featured universe on Embir.",
      images: ["/api/og?title=Universe%20of%20the%20Day&subtitle=Discover%20today%27s%20featured%20universe&variant=product"],
    },
  };
}

export default async function UniverseOfTheDayPage() {
  let profile: DailyProfile | null = null;

  try {
    // Get all public profiles — prioritize those with a displayName and description
    // (verified profiles preferred but not required — at launch most are unverified)
    const profiles = await prisma.profile.findMany({
      where: {
        profileSource: "user_registration",
        publicVisibility: true,
        visibilityStatus: "PUBLIC",
        moderationState: "ACTIVE",
        user: { is: { bannedAt: null, deletedAt: null } },
      },
      select: {
        username: true,
        displayName: true,
        age: true,
        city: true,
        country: true,
        description: true,
        isVerified: true,
        isFounder: true,
        genderIdentity: true,
        lookingFor: true,
      },
      take: 200,
    });

    // Sort: verified first, then those with displayName, then those with description
    const ranked = profiles
      .map(p => ({
        ...p,
        _rank: (p.isVerified ? 100 : 0) + (p.displayName ? 20 : 0) + (p.description ? 10 : 0),
      }))
      .sort((a, b) => b._rank - a._rank)
      .map(({ _rank, ...rest }) => rest);

    if (ranked.length > 0) {
      // Deterministic daily selection from the top tier
      const today = new Date().toISOString().slice(0, 10);
      let hash = 0;
      for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
        hash = hash & hash;
      }
      const idx = Math.abs(hash) % ranked.length;
      profile = ranked[idx];
    }
  } catch {
    // DB error — render page without profile
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 bg-[#0a0614]">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4a574]/60 mb-2">{today}</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-3">
            Universe of the Day
          </h1>
          <p className="text-white/40 text-sm">
            Every day, we reveal a new universe to explore. No swiping — just discovery.
          </p>
        </div>

        {profile ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a574] to-[#ff5e36] flex items-center justify-center text-2xl font-black text-[#0a0614]">
                {profile.displayName?.[0] || profile.username[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.displayName || profile.username}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {profile.isVerified && <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4a574]/15 text-[#d4a574] font-semibold">Verified</span>}
                  {profile.isFounder && <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff5e36]/15 text-[#ff5e36] font-semibold">Founder</span>}
                  {profile.age && <span className="text-sm text-white/40">{profile.age} y/o</span>}
                  {profile.city && <span className="text-sm text-white/40">{profile.city}</span>}
                </div>
              </div>
            </div>

            {profile.description && (
              <p className="text-white/60 text-lg leading-relaxed mb-8">{profile.description}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/u/${profile.username}`}
                className="flex-1 px-6 py-3 rounded-full bg-[#d4a574] text-[#0a0614] font-bold text-center hover:bg-[#e8c4a2] transition"
              >
                Explore this universe
              </Link>
              <Link
                href="/auth/register"
                className="flex-1 px-6 py-3 rounded-full border border-white/15 text-white font-bold text-center hover:border-white/30 transition"
              >
                Create your universe
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 text-center">
            <p className="text-white/40 text-lg mb-6">
              Today&apos;s universe is being prepared. Check back soon!
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-3 rounded-full bg-[#d4a574] text-[#0a0614] font-bold hover:bg-[#e8c4a2] transition"
            >
              Be the first to create your universe
            </Link>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-xs text-white/30">
            Come back tomorrow for a new universe to discover.
          </p>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Universe of the Day — Embir",
        "description": "Discover today's featured universe on Embir.",
        "url": "https://embir.xyz/universe-of-the-day",
        "isPartOf": { "@type": "WebSite", "name": "Embir", "url": "https://embir.xyz" },
      }) }} />
    </div>
  );
}
