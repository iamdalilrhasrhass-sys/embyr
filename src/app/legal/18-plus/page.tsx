export default function EighteenPlusPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 mx-auto bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-4xl font-bold border border-red-500/30 mb-8">
        18+
      </div>
      <h1 className="text-4xl font-bold mb-6">Avertissement Contenu Adulte</h1>
      <p className="text-xl text-[var(--color-premium-gray)] leading-relaxed mb-8">
        Embyr est une plateforme strictement réservée aux personnes majeures.
        L'accès à ce site nécessite d'avoir 18 ans révolus ou l'âge de la majorité légale dans votre pays de résidence.
      </p>
      
      <div className="glass-card p-8 rounded-2xl text-left text-gray-300 space-y-4 mb-12">
        <p>
          <strong>Vérification d'âge :</strong> Nous mettons en œuvre des mesures pour vérifier l'âge de nos membres. La création d'un profil implique l'acceptation de nos Conditions Générales et la confirmation formelle de votre majorité.
        </p>
        <p>
          <strong>Tolérance Zéro :</strong> Embyr applique une politique de tolérance zéro concernant la présence de mineurs sur la plateforme. Tout profil suspecté d'appartenir à un mineur sera immédiatement banni et signalé aux autorités compétentes.
        </p>
        <p>
          <strong>Contrôle parental :</strong> Si vous partagez votre appareil avec des mineurs, nous vous recommandons fortement d'utiliser des logiciels de contrôle parental.
        </p>
      </div>
    </div>
  );
}
