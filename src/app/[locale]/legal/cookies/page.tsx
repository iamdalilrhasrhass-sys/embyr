import { noindexMetadata } from "@/seo/noindex";

export const metadata = noindexMetadata;

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-pink">
      <h1>Politique des Cookies</h1><p>Nous utilisons uniquement des cookies strictement nécessaires pour la session (JWT) et le paiement (Stripe).</p>
    </div>
  );
}
