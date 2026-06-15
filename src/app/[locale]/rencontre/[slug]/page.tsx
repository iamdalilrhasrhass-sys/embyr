import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveFranceMeetPage, staticParams } from "@/seo/catalog";
import { SeoCityPage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return staticParams.franceMeet;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveFranceMeetPage(slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/rencontre/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const page = resolveFranceMeetPage(slug, locale);
  if (!page) notFound();
  return <SeoCityPage page={page} />;
}
