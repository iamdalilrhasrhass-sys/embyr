import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Coming Out at Your Own Pace: A Modern Guide | Embir Blog",
  description: "Modern coming out guide for gay men. Your timeline, your terms. No pressure, just practical support for every stage.",
  keywords: ["coming out", "modern coming out guide", "gay coming out", "LGBTQ support"],
  alternates: { canonical: "https://embir.xyz/blog/culture/coming-out-at-your-own-pace" },
};

export default function Page() {
  return <BlogArticle slug="culture/coming-out-at-your-own-pace" />;
}
