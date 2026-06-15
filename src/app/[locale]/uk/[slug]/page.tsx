import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMarketCityPage, resolveMarketProductPage, staticParams } from "@/seo/catalog";
import { SeoCityPage, SeoGuidePage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return [...staticParams.uk, ...staticParams.marketProductUk];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveMarketProductPage("uk", slug, locale) ?? resolveMarketCityPage("uk", slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/uk/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const page = resolveMarketProductPage("uk", slug, locale) ?? resolveMarketCityPage("uk", slug, locale);
  if (!page) notFound();
  return page.kind === "city" ? <SeoCityPage page={page} /> : <SeoGuidePage page={page} />;
}
