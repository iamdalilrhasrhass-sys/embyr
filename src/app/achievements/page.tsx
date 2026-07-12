import { notFound } from "next/navigation";

export const metadata = {
  title: "Not found — Embir",
  robots: { index: false, follow: false },
};

export default function AchievementsPage() {
  notFound();
}
