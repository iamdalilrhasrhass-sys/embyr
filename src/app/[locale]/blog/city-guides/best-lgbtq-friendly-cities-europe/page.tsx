import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "The Best LGBTQ+ Friendly Cities in Europe | Embir Blog",
  description: "The top LGBTQ+ friendly cities in Europe for gay travelers and residents. Nightlife, culture, safety, and community.",
  keywords: ["LGBTQ friendly cities", "gay friendly Europe", "best gay cities", "gay travel Europe"],
  alternates: { canonical: "https://embir.xyz/blog/city-guides/best-lgbtq-friendly-cities-europe" },
};

export default function Page() {
  return <BlogArticle slug="city-guides/best-lgbtq-friendly-cities-europe" />;
}
