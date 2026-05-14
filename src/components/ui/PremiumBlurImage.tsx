"use client";
import { usePremium } from "@/hooks/usePremium";
import Link from "next/link";

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
  silhouette?: boolean;
}

export default function PremiumBlurImage({ src, alt, className = "", silhouette = false }: Props) {
  const { isPremium, loading } = usePremium();

  if (loading) {
    return <div className={`bg-white/[0.02] animate-pulse ${className}`} />;
  }

  // PREMIUM : image normale, nette, zéro overlay
  if (isPremium) {
    if (!src) {
      return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-rose-500/10 ${className}`}>
          <span className="text-4xl opacity-15">👤</span>
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          const p = (e.target as HTMLImageElement).parentElement!;
          p.classList.add("flex", "items-center", "justify-center", "bg-gradient-to-br", "from-purple-500/10", "via-fuchsia-500/5", "to-rose-500/10");
          p.innerHTML = '<span class="text-4xl opacity-15">👤</span>';
        }}
      />
    );
  }

  // NON-PREMIUM sans image : placeholder élégant
  if (!src || silhouette) {
    return (
      <Link href="/premium" className={`relative flex items-center justify-center bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-rose-500/10 overflow-hidden group ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="text-5xl opacity-12 group-hover:opacity-20 transition-opacity">👤</span>
        <div className="absolute bottom-1.5 right-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/30 text-white/40 backdrop-blur-sm border border-white/5">
            Photos premium
          </span>
        </div>
      </Link>
    );
  }

  // NON-PREMIUM avec image : flou léger, lisible
  return (
    <Link href="/premium" className={`relative block overflow-hidden group ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover blur-[3px] brightness-[0.75] scale-105 group-hover:scale-100 transition-all duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/30 text-white/45 backdrop-blur-sm border border-white/5">
          Photos premium
        </span>
      </div>
    </Link>
  );
}
