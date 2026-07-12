"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const SITE_URL = "https://embir.xyz";
const SHARE_MESSAGE =
  "Découvre Embir — l'app de rencontre gay dont les connexions essentielles sont gratuites, sans pubs et sans limite  Rejoins la communauté dès maintenant !";

const platforms = [
  {
    name: "WhatsApp",
    icon: "💬",
    color: "hover:bg-[#25D366]/20",
    getUrl: (url: string) =>
      `https://wa.me/?text=${encodeURIComponent(SHARE_MESSAGE + " " + url)}`,
  },
  {
    name: "Twitter / X",
    icon: "🐦",
    color: "hover:bg-white/10",
    getUrl: (url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_MESSAGE)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: "👍",
    color: "hover:bg-[#1877F2]/20",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(SHARE_MESSAGE)}`,
  },
  {
    name: "Telegram",
    icon: "✈️",
    color: "hover:bg-[#0088cc]/20",
    getUrl: (url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(SHARE_MESSAGE)}`,
  },
  {
    name: "SMS",
    icon: "📱",
    color: "hover:bg-white/10",
    getUrl: (url: string) =>
      `sms:?body=${encodeURIComponent(SHARE_MESSAGE + " " + url)}`,
  },
];

export default function ShareWidget() {
  const pathname = usePathname();
  const locale = useLocale();
  const fullUrl = `${SITE_URL}${pathname}`;

  return (
    <div className="mt-12 pt-8 border-t border-white/5">
      <p className="text-white/40 text-sm mb-4">📢 Partage cette page :</p>
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.getUrl(fullUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white/60 transition-all ${platform.color} hover:text-white hover:border-white/20`}
            title={`Partager sur ${platform.name}`}
          >
            <span>{platform.icon}</span>
            <span className="hidden sm:inline">{platform.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
