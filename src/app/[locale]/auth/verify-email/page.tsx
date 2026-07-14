import type { Metadata } from "next";
import EmailVerificationClient from "@/components/auth/EmailVerificationClient";

export const metadata: Metadata = {
  title: "Vérification email — Embir",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <EmailVerificationClient locale={locale} />;
}
