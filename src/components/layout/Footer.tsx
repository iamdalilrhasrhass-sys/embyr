import Link from "next/link";
import { getTranslations } from "next-intl/server";
import EmbirLogo from "@/components/brand/EmbirLogo";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-[#070409] border-t border-white/6 py-12 mt-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff1f5a]/35 via-[#ff5e36]/35 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <EmbirLogo size="md" showTagline />
            <p className="mt-4 text-sm leading-relaxed text-white/40 max-w-xs">
              {t("tagline")}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ff5e36]/75">
              {t("adult")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">
              {t("navigation")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "free_launch", href: "/free-dating-app" },
                { key: "freemium", href: "/freemium" },
                { key: "us", href: "/us" },
                { key: "uk", href: "/uk" },
                { key: "ch", href: "/switzerland" },
                { key: "orientations", href: "/lgbtq-dating-app" },
                { key: "safety", href: "/verified-dating-app" },
                { key: "about", href: "/about" },
                { key: "members", href: "/membres" },
              ].map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  prefetch={false}
                  className="text-sm text-white/35 hover:text-white/70 transition-colors"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">
              {t("legal")}
            </h3>
            <div className="space-y-2">
              {[
                { key: "terms", href: "/terms" },
                { key: "privacy", href: "/privacy" },
                { key: "age", href: "/age-verification" },
                { key: "moderation", href: "/moderation" },
                { key: "support", href: "/support" },
              ].map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  prefetch={false}
                  className="block text-sm text-white/35 hover:text-white/70 transition-colors"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Embir. {t("rights")}
          </p>
          <p className="text-xs text-white/20">
            {t("regions")}
          </p>
        </div>
      </div>
    </footer>
  );
}
