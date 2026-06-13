"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  id: string;
  displayName?: string;
  username?: string;
  age?: number;
  city?: string;
  description?: string;
  isVerified?: boolean;
  isFounder?: boolean;
  isPremium?: boolean;
  profileCompletionScore?: number;
  intentions?: string[];
}

function ProfileCard({ profile, onLike, onPass }: { profile: Profile; onLike: () => void; onPass: () => void }) {
  const badges: string[] = [];
  if (profile.isVerified) badges.push("Verified");
  if (profile.isFounder) badges.push("Founder");
  if (profile.isPremium) badges.push("Premium");

  return (
    <div className="relative max-w-md mx-auto p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="w-full h-56 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center text-6xl mb-4 text-white/20">
        {profile.displayName?.[0] || "?"}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-bold text-white">{profile.displayName || profile.username}</h3>
        {badges.map(b => (
          <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50">{b}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-white/40 mb-3">
        {profile.city && <span>{profile.city}</span>}
        {profile.age && <span>{profile.age} y/o</span>}
      </div>

      {profile.description && (
        <p className="text-white/50 text-sm mb-6 line-clamp-3">{profile.description}</p>
      )}

      {profile.intentions && profile.intentions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {profile.intentions.slice(0, 3).map((intent: string) => (
            <span key={intent} className="text-xs px-2 py-1 rounded-lg bg-white/[0.04] text-white/60 border border-white/[0.06]">
              {intent}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onPass}
          className="flex-1 py-3 rounded-xl border border-white/[0.06] text-white/40 hover:bg-white/[0.04] hover:text-white/60 transition-colors font-medium"
        >
          Pass
        </button>
        <button
          onClick={onLike}
          className="flex-1 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Like
        </button>
      </div>
    </div>
  );
}

export default function DecouvrirPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profiles/latest?limit=20")
      .then((r) => r.json())
      .then((d) => {
        const items = Array.isArray(d) ? d : d.profiles || d.data || [];
        setProfiles(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLike = () => {
    const profile = profiles[current];
    if (!profile) return;
    fetch(`/api/favorites/${profile.id}`, { method: "POST" }).catch(() => {});
    setCurrent((c) => c + 1);
  };

  const handlePass = () => {
    setCurrent((c) => c + 1);
  };

  if (loading) {
    return (
      <main className="emb-page min-h-screen flex items-center justify-center">
        <p className="text-white/40">Loading profiles...</p>
      </main>
    );
  }

  if (profiles.length === 0) {
    return (
      <main className="emb-page min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-3">No profiles yet</h2>
          <p className="text-white/40 mb-6">Be the first to join and help grow the community.</p>
          <Link href="/inviter" className="inline-flex rounded-full bg-white text-black px-6 py-3 text-sm font-medium">
            Invite friends
          </Link>
        </div>
      </main>
    );
  }

  if (current >= profiles.length) {
    return (
      <main className="emb-page min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-3">You've seen everyone</h2>
          <p className="text-white/40 mb-6">Check back soon for new profiles.</p>
          <button onClick={() => setCurrent(0)} className="rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors">
            Start over
          </button>
        </div>
      </main>
    );
  }

  const profile = profiles[current];

  return (
    <main className="emb-page min-h-screen py-24 px-4">
      <div className="max-w-md mx-auto">
        <ProfileCard
          profile={profile}
          onLike={handleLike}
          onPass={handlePass}
        />
        <p className="text-center text-white/20 text-xs mt-4">
          {current + 1} of {profiles.length}
        </p>
      </div>
    </main>
  );
}
