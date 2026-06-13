import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Navigating Hookup Culture vs. Meaningful Connections | Embir Blog",
  description: "Finding balance between hookup culture and meaningful relationships in gay dating. Honest, no-judgment perspective.",
  keywords: ["hookup culture", "meaningful connections", "gay dating culture", "gay relationships"],
  alternates: { canonical: "https://embir.xyz/blog/culture/hookup-culture-vs-meaningful-connections" },
};

export default function Page() {
  return <BlogArticle slug="culture/hookup-culture-vs-meaningful-connections" />;
}
