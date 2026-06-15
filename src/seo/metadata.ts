import type { Metadata } from "next";
import type { ResolvedSeoPage } from "./catalog";
import { absoluteUrl, buildLanguageAlternates } from "./url";

export function buildSeoMetadata(page: ResolvedSeoPage, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title: page.title,
    description: page.description,
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
      title: page.title,
      description: page.description,
      url,
      images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [absoluteUrl("/og-image.png")],
    },
  };
}
