import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Online Safety Guide: Protecting Yourself on Gay Dating Apps | Embir Blog",
  description: "Stay safe on gay dating apps. Practical safety guide covering privacy, first meetings, and red flags to watch for.",
  keywords: ["gay dating safety", "online safety", "protect yourself", "dating app safety"],
  alternates: { canonical: "https://embir.xyz/blog/safety/online-dating-safety-guide" },
};

export default function Page() {
  return <BlogArticle slug="safety/online-dating-safety-guide" />;
}
