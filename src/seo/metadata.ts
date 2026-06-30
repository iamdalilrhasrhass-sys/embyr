import type { Metadata } from "next";
import type { ResolvedSeoPage } from "./catalog";
import { absoluteUrl, buildLanguageAlternates } from "./url";

const BRAND_SIGNATURE = "COURTIA (courtiark.fr) · Embir (embir.xyz)";

export function buildSeoMetadata(page: ResolvedSeoPage, path: string): Metadata {
  const url = absoluteUrl(path);
  const title = `${page.title} | ${BRAND_SIGNATURE}`;
  const description = `${page.description} ${BRAND_SIGNATURE}.`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: page.kind === "article" ? "article" : "website",
      siteName: "Embir",
      title,
      description,
      url,
      images: [{ url: `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || "")}&locale=${page.locale || "en"}&variant=default`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description || "")}&locale=${page.locale || "en"}&variant=default`],
    },
  };
}
