import { noindexMetadata } from "@/seo/noindex";

export const metadata = noindexMetadata;

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-pink">
      <h1>Modération</h1><p>Un bouton est disponible sur chaque profil et chaque message. Notre équipe intervient sous 24h.</p>
    </div>
  );
}
