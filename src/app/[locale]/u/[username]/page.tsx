import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CompatibilityScore from "@/components/CompatibilityScore";

export const revalidate = 0;

interface UniverseData {
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

async function getUniverse(username: string): Promise<UniverseData | null> {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        username,
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
    });

    return profile;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const data = await getUniverse(username);
  if (!data) {
    return {
      title: "Universe not found — Embir",
      robots: { index: false, follow: false },
    };
  }

  const name = data.displayName || data.username;
  const location = [data.city, data.country].filter(Boolean).join(", ");
  const desc =
    data.description ||
    `${name}'s public profile on Embir${location ? ` · ${location}` : ""}.`;
  const ogTitle = `${name}'s Universe — Embir`;
  const ogUrl = `https://embir.xyz/u/${data.username}`;

  return {
    title: `${name}'s Universe — Embir`,
    description: desc.slice(0, 160),
    alternates: { canonical: ogUrl },
    openGraph: {
      title: ogTitle,
      description: desc.slice(0, 160),
      url: ogUrl,
      siteName: "Embir",
      type: "profile",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(ogTitle)}&subtitle=${encodeURIComponent(desc.slice(0, 120))}&locale=en&variant=referral`,
          width: 1200,
          height: 630,
          alt: `${name}'s Embir Universe`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc.slice(0, 160),
      images: [`/api/og?title=${encodeURIComponent(ogTitle)}&subtitle=${encodeURIComponent(desc.slice(0, 120))}&locale=en&variant=referral`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function UniversePage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}) {
  const { username } = await params;
  const data = await getUniverse(username);

  if (!data) notFound();

  const name = data.displayName || data.username;
  const location = [data.city, data.country].filter(Boolean).join(", ");
  const shareUrl = `https://embir.xyz/u/${data.username}`;

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          {/* Avatar placeholder with initials */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#d4a574] via-[#ff5e36] to-[#ff1f5a] text-3xl font-black text-[#0a0614]">
            {name.charAt(0).toUpperCase()}
          </div>

          {/* Name + badges */}
          <div className="flex items-center justify-center gap-3">
            <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">{name}</h1>
            {data.isVerified && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4a574]/20 text-sm text-[#d4a574]" title="Verified">
                ✓
              </span>
            )}
            {data.isFounder && (
              <span className="rounded-full border border-[#ff5e36]/30 bg-[#ff5e36]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ff5e36]">
                Founder
              </span>
            )}
          </div>

          {/* Meta line */}
          <div className="mt-3 flex items-center justify-center gap-4 text-sm text-white/40">
            <span>@{data.username}</span>
            {data.age > 0 && <span>{data.age}y</span>}
            {location && <span>{location}</span>}
          </div>

        </div>

        {/* Description */}
        {data.description && (
          <div className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <p className="text-base leading-relaxed text-white/60">{data.description}</p>
          </div>
        )}

        {/* Universe attributes */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.genderIdentity && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-wider text-white/30">Identity</p>
              <p className="mt-1 text-sm text-white/70 capitalize">{data.genderIdentity}</p>
            </div>
          )}
          {data.lookingFor && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-wider text-white/30">Looking for</p>
              <p className="mt-1 text-sm text-white/70 capitalize">{data.lookingFor}</p>
            </div>
          )}
        </div>

        {/* Share buttons */}
        <div className="mt-10">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/30">Share this universe</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Discover ${name}'s universe on Embir`)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#d4a574]/30 hover:text-[#d4a574]"
            >
              𝕏
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Discover ${name}'s universe on Embir`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#d4a574]/30 hover:text-[#d4a574]"
            >
              ✈
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Discover ${name}'s universe on Embir: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#d4a574]/30 hover:text-[#d4a574]"
            >
              W
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#d4a574]/30 hover:text-[#d4a574]"
            >
              f
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-[#d4a574]/20 bg-gradient-to-r from-[#d4a574]/[0.08] via-[#ff5e36]/[0.04] to-[#ff1f5a]/[0.08] p-8 text-center">
          <h2 className="font-serif text-2xl font-light text-white">
            Create your own universe
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            Everything needed to meet someone is free. No credit card required.
          </p>
          <Link
            href="/early-access"
            prefetch={false}
            className="mt-6 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
          >
            Join Embir
          </Link>
        </div>

        {/* Compatibility Score */}
        <CompatibilityScore username={data.username} displayName={name} />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: name,
              description: data.description || undefined,
              address: location
                ? { "@type": "PostalAddress", addressLocality: data.city || undefined, addressCountry: data.country || undefined }
                : undefined,
            },
          }),
        }}
      />
    </main>
  );
}
