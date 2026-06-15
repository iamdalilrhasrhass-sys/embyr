import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMarketCityPage, staticParams } from "@/seo/catalog";
import { SeoCityPage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return staticParams.switzerland.filter((item) => item.locale === "fr");
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "fr") return {};
  const page = resolveMarketCityPage("switzerland", slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/suisse/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (locale !== "fr") notFound();
  const page = resolveMarketCityPage("switzerland", slug, locale);
  if (!page) notFound();
  return <SeoCityPage page={page} />;
}
