import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "The Psychology of Attraction: What Really Matters | Embir Blog",
  description: "What science says about gay male attraction. Beyond looks — personality, chemistry, and what creates lasting connections.",
  keywords: ["gay attraction", "psychology of attraction", "dating psychology", "male attraction"],
  alternates: { canonical: "https://embir.xyz/blog/dating-tips/psychology-of-attraction-gay-men" },
};

export default function Page() {
  return <BlogArticle slug="dating-tips/psychology-of-attraction-gay-men" />;
}
