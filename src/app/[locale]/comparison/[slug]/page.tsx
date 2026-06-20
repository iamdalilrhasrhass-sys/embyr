import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveComparisonPage, staticParams } from "@/seo/catalog";
import { buildSeoMetadata } from "@/seo/metadata";
import Navbar from "@/components/layout/Navbar";
import { RichComparisonContent } from "@/components/rich-content";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return staticParams.comparisonsEnAlias;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveComparisonPage(slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/comparison/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const page = resolveComparisonPage(slug, locale);
  if (!page) notFound();

  const isFr = locale === "fr";

  return (
    <>
      <Navbar showLogo />
      <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap gap-2 text-xs text-white/35" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[#d4a574]">Home</a>
            <span>/</span>
            <a href={isFr ? "/fr/comparaison/alternative-tinder" : "/comparison/tinder-alternative"} className="hover:text-[#d4a574]">
              {isFr ? "Comparatifs" : "Comparisons"}
            </a>
            <span>/</span>
            <span className="text-white/50">{page.h1}</span>
          </nav>

          {/* Header */}
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">
            COMPARISON · {isFr ? "Gratuit au lancement" : "Free at launch"}
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/50">
            {page.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
            <span>Embir Team</span>
            <span>·</span>
            <span>Updated 2026-06-20</span>
            <span>·</span>
            <span>{isFr ? "France / Royaume-Uni / États-Unis" : "France / UK / US"}</span>
          </div>

          {/* Rich content */}
          <RichComparisonContent page={page} />
        </article>
      </main>
    </>
  );
}
