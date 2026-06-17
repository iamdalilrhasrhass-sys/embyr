import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

interface Market {
  nameKey: string;
  focusKey: string;
  href: string;
}

function buildMarkets(locale: string): Market[] {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return [
    { nameKey: "markets_title_fr", focusKey: "markets_focus_fr", href: "/fr" },
    { nameKey: "markets_title_uk", focusKey: "markets_focus_uk", href: "/uk" },
    { nameKey: "markets_title_us", focusKey: "markets_focus_us", href: "/us" },
    { nameKey: "markets_title_ch", focusKey: "markets_focus_ch", href: "/switzerland" },
  ];
}

const PROOF_KEYS = [1, 2, 3, 4, 5, 6] as const;

const CARD_ITEMS = [
  "card_orientation",
  "card_preferences",
  "card_compatibility",
  "card_safety",
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const markets = buildMarkets(locale);

  return (
    <>
      <Navbar showLogo />
      <main className="emb-page min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <SchemaOrg />

        {/* Hero */}
        <section className="mx-auto grid max-w-7xl gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
              {t("badge")}
            </p>
            <h1 className="mt-8 max-w-5xl font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl">
              {t("title")}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/58 sm:text-xl">
              {t("subtitle")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/early-access"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
              >
                {t("cta_early_access")}
              </Link>
              <Link
                href="/auth/register"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-[#d4a574]/35 hover:text-white"
              >
                {t("cta_create")}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/38">
              {t("founder_strip").split(" · ").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Card visual */}
          <div className="rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <div className="rounded-[1.5rem] border border-white/[0.06] bg-[#0d0816] p-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  embir<span className="text-[#ff5e36]">.</span>
                </span>
                <span className="rounded-full border border-[#d4a574]/20 px-3 py-1 text-xs text-[#d4a574]">
                  {t("card_founder_phase")}
                </span>
              </div>
              <div className="mt-8 space-y-4">
                {CARD_ITEMS.map((key, index) => (
                  <div key={key} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white/82">{t(key)}</span>
                      <span className="text-xs text-white/32">0{index + 1}</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#d4a574]"
                        style={{ width: `${72 + index * 6}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm leading-relaxed text-white/45">
                {t("card_join_text")}
              </p>
            </div>
          </div>
        </section>

        {/* Markets */}
        <section className="mx-auto max-w-7xl py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {markets.map((market) => (
              <Link
                key={market.nameKey}
                href={market.href}
                prefetch={false}
                className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7 transition hover:border-[#d4a574]/25 hover:bg-white/[0.04]"
              >
                <h2 className="font-serif text-4xl font-light text-white">{t(market.nameKey)}</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/45">{t(market.focusKey)}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Proof points */}
        <section className="mx-auto max-w-7xl py-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROOF_KEYS.map((n) => (
              <article key={n} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7">
                <h2 className="font-serif text-3xl font-light text-white">{t(`proof_${n}_title`)}</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/45">{t(`proof_${n}_text`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Founder CTA */}
        <section className="mx-auto max-w-5xl py-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/75">
            {t("founder_cta_tag")}
          </p>
          <h2 className="mt-5 font-serif text-4xl font-light text-white sm:text-6xl">
            {t("founder_cta_title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/45">
            {t("founder_cta_text")}
          </p>
          <Link
            href="/early-access"
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
          >
            {t("founder_cta_button")}
          </Link>
        </section>
      </main>
    </>
  );
}
