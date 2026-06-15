import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMarketLandingPage } from "@/seo/catalog";
import { SeoGuidePage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const page = resolveMarketLandingPage("usa", locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/us`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  const page = resolveMarketLandingPage("usa", locale);
  if (!page) notFound();
  return <SeoGuidePage page={page} />;
}
