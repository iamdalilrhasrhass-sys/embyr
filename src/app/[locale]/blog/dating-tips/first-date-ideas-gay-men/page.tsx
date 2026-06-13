import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "First Date Ideas for Gay Men: Beyond the Usual Bars | Embir Blog",
  description: "Creative first date ideas for gay men that go beyond drinks at a bar. Make your first impression memorable and authentic.",
  keywords: ["first date ideas", "gay date", "dating ideas", "first date tips"],
  alternates: { canonical: "https://embir.xyz/blog/dating-tips/first-date-ideas-gay-men" },
};

export default function Page() {
  return <BlogArticle slug="dating-tips/first-date-ideas-gay-men" />;
}
