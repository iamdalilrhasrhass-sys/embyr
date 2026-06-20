import { noindexMetadata } from "@/seo/noindex";

export const metadata = noindexMetadata;

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-pink">
      <h1>Politique de Confidentialité</h1><p>Vos données sont chiffrées (bcrypt). Les conversations privées ne sont pas lues sans signalement explicite. Vous pouvez supprimer votre compte à tout moment.</p>
    </div>
  );
}
