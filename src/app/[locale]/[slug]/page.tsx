import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveRootSeoPage, staticParams } from "@/seo/catalog";
import { SeoGuidePage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return staticParams.root;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveRootSeoPage(slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const page = resolveRootSeoPage(slug, locale);
  if (!page) notFound();
  return <SeoGuidePage page={page} />;
}
