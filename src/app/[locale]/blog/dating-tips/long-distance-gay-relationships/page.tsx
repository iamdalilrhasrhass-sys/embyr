import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Long-Distance Gay Relationships: Making Them Work | Embir Blog",
  description: "How to make long-distance gay relationships thrive. Communication strategies, trust building, and practical tools for LDR success.",
  keywords: ["long distance gay relationship", "LDR tips", "gay LDR", "long distance dating"],
  alternates: { canonical: "https://embir.xyz/blog/dating-tips/long-distance-gay-relationships" },
};

export default function Page() {
  return <BlogArticle slug="dating-tips/long-distance-gay-relationships" />;
}
