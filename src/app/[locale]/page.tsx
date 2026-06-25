import Landing2100 from "@/components/landing-2100/Landing2100";

export const revalidate = 3600;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <Landing2100 locale={locale === "fr" ? "fr" : "en"} />;
}
