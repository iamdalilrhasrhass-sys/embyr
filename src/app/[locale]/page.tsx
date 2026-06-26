import Landing2100 from "@/components/landing-2100/Landing2100";
import { landingCopy, type LandingLocale } from "@/components/landing-2100/landing-copy";

export const revalidate = 3600;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const landingLocale: LandingLocale = locale in landingCopy ? (locale as LandingLocale) : "en";

  return <Landing2100 locale={landingLocale} />;
}
