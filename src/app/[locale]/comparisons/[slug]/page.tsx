import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveComparisonPage, staticParams } from "@/seo/catalog";
import { SeoComparisonPage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return staticParams.comparisonsEn;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveComparisonPage(slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/comparisons/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const page = resolveComparisonPage(slug, locale);
  if (!page) notFound();
  return <SeoComparisonPage page={page} />;
}
