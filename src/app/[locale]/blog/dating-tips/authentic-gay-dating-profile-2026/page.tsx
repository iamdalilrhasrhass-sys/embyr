import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "How to Create an Authentic Gay Dating Profile in 2026 | Embir Blog",
  description: "Create a gay dating profile that actually attracts the right guys. Practical tips for authentic profiles on dating apps like Embir.",
  keywords: ["gay dating profile", "authentic profile", "profile tips", "dating app profile"],
  alternates: { canonical: "https://embir.xyz/blog/dating-tips/authentic-gay-dating-profile-2026" },
};

export default function Page() {
  return <BlogArticle slug="dating-tips/authentic-gay-dating-profile-2026" />;
}
