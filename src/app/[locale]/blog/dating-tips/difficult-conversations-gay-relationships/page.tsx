import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "How to Have Difficult Conversations in Gay Relationships | Embir Blog",
  description: "Master difficult conversations in gay relationships. Communication frameworks for exclusivity, needs, boundaries, and conflict.",
  keywords: ["difficult conversations", "gay relationship advice", "communication", "gay couples"],
  alternates: { canonical: "https://embir.xyz/blog/dating-tips/difficult-conversations-gay-relationships" },
};

export default function Page() {
  return <BlogArticle slug="dating-tips/difficult-conversations-gay-relationships" />;
}
