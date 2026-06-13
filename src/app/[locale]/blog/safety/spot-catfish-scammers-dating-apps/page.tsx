import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "How to Spot Catfish and Scammers on Dating Apps | Embir Blog",
  description: "Learn to identify fake profiles, catfish, and scammers on gay dating apps. Red flags, verification tips, and protection strategies.",
  keywords: ["spot catfish", "dating app scammers", "fake profiles", "dating safety"],
  alternates: { canonical: "https://embir.xyz/blog/safety/spot-catfish-scammers-dating-apps" },
};

export default function Page() {
  return <BlogArticle slug="safety/spot-catfish-scammers-dating-apps" />;
}
