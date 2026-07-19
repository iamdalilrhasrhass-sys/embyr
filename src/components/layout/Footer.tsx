import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import EmbirLogo from "@/components/brand/EmbirLogo";
import { localePath, supportedLocale } from "@/components/connection-os/types";

export default async function Footer() {
  const t = await getTranslations("footer");
  const brand = await getTranslations("brand");
  const locale = supportedLocale(await getLocale());

  return (
    <footer className="relative border-t border-white/[0.1] bg-embir-void py-12">
      <div className="mx-auto max-w-[92rem] px-4">
        <div className="grid gap-10 border-b border-white/[0.1] pb-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <EmbirLogo size="md" tagline={brand("tagline")} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--embir-muted-on-dark)]">
              {t("tagline")}
            </p>
            <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-embir-rose">
              {t("adult")}
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-embir-rose">
              {t("navigation")}
            </h3>
            <div className="grid grid-cols-2 border-t border-white/[0.1]">
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
                  href={localePath(locale, href)}
                  prefetch={false}
                  className="flex min-h-11 items-center border-b border-white/[0.1] py-2.5 text-sm text-[var(--embir-muted-on-dark)] transition-colors hover:text-white/80"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-embir-rose">
              {t("legal")}
            </h3>
            <div className="border-t border-white/[0.1]">
              {[
                { key: "terms", href: "/terms" },
                { key: "privacy", href: "/privacy" },
                { key: "age", href: "/age-verification" },
                { key: "moderation", href: "/moderation" },
                { key: "support", href: "/support" },
              ].map(({ key, href }) => (
                <Link
                  key={key}
                  href={localePath(locale, href)}
                  prefetch={false}
                  className="flex min-h-11 items-center border-b border-white/[0.1] py-2.5 text-sm text-[var(--embir-muted-on-dark)] transition-colors hover:text-white/80"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
          <p className="text-xs text-[var(--embir-muted-on-dark)]">
            &copy; {new Date().getFullYear()} Embir. {t("rights")}
          </p>
          <p className="text-xs text-[var(--embir-muted-on-dark)]">
            {t("regions")}
          </p>
        </div>
      </div>
    </footer>
  );
}
