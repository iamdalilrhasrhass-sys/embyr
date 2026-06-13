import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Gay Dating in 2026: Trends and Changes | Embir Blog",
  description: "How gay dating is changing in 2026. AI matching, privacy-first apps, and the decline of traditional paywalls.",
  keywords: ["gay dating trends 2026", "dating trends", "gay dating future", "dating app trends"],
  alternates: { canonical: "https://embir.xyz/blog/culture/gay-dating-trends-2026" },
};

export default function Page() {
  return <BlogArticle slug="culture/gay-dating-trends-2026" />;
}
