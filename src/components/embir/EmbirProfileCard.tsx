"use client";
import Link from "next/link";
import Card3DTilt from "./Card3DTilt";

export default function EmbirProfileCard({
  id, username, displayName, age, city, isPremium, isOnline, photoUrl,
}: {
  id: string; username?: string; displayName?: string; age?: number; city?: string;
  isPremium?: boolean; isOnline?: boolean; photoUrl?: string;
}) {
  const name = displayName || username || "Membre";
  return (
    <Link href={`/profiles/${id}`}>
      <Card3DTilt className="rounded-[var(--eb-radius-card)] overflow-hidden cursor-pointer h-full" intensity={8}>
        <div className="relative aspect-[3/4] bg-[var(--eb-bg-elev-2)]">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">E</div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[var(--eb-success)] border-2 border-[var(--eb-bg-base)] animate-pulse" />
          )}
          {/* Badges */}
          {isPremium && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-[var(--eb-radius-badge)] text-[10px] font-medium bg-[var(--eb-copper)] text-white">Premium</div>
          )}
          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="font-[var(--eb-font-display)] text-base text-[var(--eb-text-primary)] font-medium">{name}</p>
            <p className="text-xs text-[var(--eb-text-muted)]">{age ? `${age} ans` : ""}{age && city ? " • " : ""}{city || ""}</p>
          </div>
        </div>
      </Card3DTilt>
    </Link>
  );
}
