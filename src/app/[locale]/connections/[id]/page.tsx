import type { Metadata } from "next";
import { ConnectionJourney } from "@/components/connection-os/ConnectionJourney";
import { supportedLocale } from "@/components/connection-os/types";

const titles = {
  fr: "Connexion — Embir",
  en: "Connection — Embir",
  es: "Conexión — Embir",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: titles[supportedLocale(locale)],
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function ConnectionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <ConnectionJourney locale={supportedLocale(locale)} connectionId={id} />;
}
