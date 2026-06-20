import { noindexMetadata } from "@/seo/noindex";

export const metadata = noindexMetadata;

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-pink">
      <h1>Conditions de Paiement</h1><p>Abonnements sans engagement. Vous pouvez annuler votre renouvellement à tout moment dans votre Tableau de Bord.</p>
    </div>
  );
}
