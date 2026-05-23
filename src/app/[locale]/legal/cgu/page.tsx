export default function CGUPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-pink">
      <h1>Conditions Générales d'Utilisation (CGU)</h1>
      <p className="text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      
      <h2>1. Présentation de la plateforme</h2>
      <p>Embyr est une plateforme numérique premium dédiée à la mise en relation entre adultes consentants. L'accès est strictement réservé aux personnes de plus de 18 ans.</p>
      
      <h2>2. Conditions d'accès</h2>
      <p>L'utilisation de Embyr nécessite :</p>
      <ul>
        <li>D'être majeur(e) dans votre juridiction de résidence (18+).</li>
        <li>De fournir des informations exactes lors de l'inscription.</li>
        <li>De passer la procédure de vérification d'identité lorsque demandée.</li>
      </ul>

      <h2>3. Modération et Sécurité</h2>
      <p>Embyr applique une politique de tolérance zéro envers :</p>
      <ul>
        <li>La présence de mineurs.</li>
        <li>Le harcèlement, la violence, et les discours de haine.</li>
        <li>Toute activité illégale selon le droit français.</li>
      </ul>
      <p>Les utilisateurs disposent d'un bouton de signalement accessible sur chaque profil et chaque conversation.</p>

      <h2>4. Gratuité Nocturne (00h00 - 07h00)</h2>
      <p>Certaines fonctionnalités payantes deviennent accessibles gratuitement durant la plage horaire définie (00h00 - 07h00, heure du serveur). Cette offre peut être modifiée à tout moment.</p>

      <h2>5. Paiements et Abonnements</h2>
      <p>Les tarifs sont clairs et affichés sur la page dédiée. Les transactions sont sécurisées par notre partenaire de paiement (Stripe).</p>

      <h2>6. Suppression des données (RGPD)</h2>
      <p>Vous pouvez à tout moment demander la suppression définitive de votre compte et de vos données personnelles via les paramètres de votre compte ou en contactant notre support.</p>
    </div>
  );
}
