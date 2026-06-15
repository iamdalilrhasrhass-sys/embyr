import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveArticlePage, staticParams } from "@/seo/catalog";
import { SeoArticlePage } from "@/components/seo-pages";
import { buildSeoMetadata } from "@/seo/metadata";

type Params = Promise<{ locale: "en" | "fr"; slug: string }>;

export function generateStaticParams() {
  return staticParams.blog;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveArticlePage(slug, locale);
  if (!page) return {};
  return buildSeoMetadata(page, `/${locale}/blog/${slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const page = resolveArticlePage(slug, locale);
  if (!page) notFound();
  return <SeoArticlePage page={page} />;
}
