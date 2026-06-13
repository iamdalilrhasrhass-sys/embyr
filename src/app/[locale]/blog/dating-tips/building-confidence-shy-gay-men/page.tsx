import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Building Confidence: A Guide for Shy Gay Men | Embir Blog",
  description: "Practical confidence-building strategies for shy gay men in dating. From first message to first date.",
  keywords: ["shy gay men", "dating confidence", "build confidence", "social anxiety dating"],
  alternates: { canonical: "https://embir.xyz/blog/dating-tips/building-confidence-shy-gay-men" },
};

export default function Page() {
  return <BlogArticle slug="dating-tips/building-confidence-shy-gay-men" />;
}
