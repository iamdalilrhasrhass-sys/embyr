import type { SupportedLocale } from "@/components/connection-os/types";

export const dashboardCopy = {
  fr: {
    free: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.",
    eyebrow: "Connection OS",
    title: "Moins de profils. Plus de réciprocité.",
    subtitle:
      "Choisis ton signal, découvre une courte sélection, puis réagis à quelque chose de vrai.",
    profile: "Mon profil",
    steps: ["Signal", "Étincelle", "Connexions actives"],
    sparkTitle: "Tes étincelles",
    sparkIntro:
      "Une sélection courte, construite à partir de préférences déclarées des deux côtés.",
    sparkCount: (count: number) =>
      `${count} profil${count > 1 ? "s" : ""} dans cette sélection`,
    sparkEmptyTitle: "Ta sélection est terminée",
    sparkEmptyBody:
      "Pas de défilement sans fin. Ajuste ton signal ou reviens quand de nouveaux profils compatibles sont disponibles.",
    densityLow:
      "La densité est encore faible autour de toi. Élargir ton rayon peut aider sans dégrader tes critères essentiels.",
    editPreferences: "Ajuster mes préférences",
    invite: "Inviter une personne",
    inviteCopied: "Lien d’invitation copié",
    noSignalTitle: "Active d’abord un signal",
    noSignalBody:
      "Embir ne te montre personne tant que ton intention du moment n’est pas claire.",
    retry: "Réessayer",
    loadError: "Impossible de charger cette sélection.",
    loading: "Préparation de ta sélection…",
    match: "Connexion réciproque créée ✦",
    signalSaved: "Ton signal est actif.",
    signalRemoved: "Signal désactivé.",
    actionError: "L’action n’a pas pu être enregistrée.",
    authRedirect: "Redirection vers la connexion…",
    onboardingRedirect:
      "Ton profil doit être complété avant de créer un signal.",
  },
  en: {
    free: "Everything you need to meet someone is free. No credit card required.",
    eyebrow: "Connection OS",
    title: "Fewer profiles. More reciprocity.",
    subtitle:
      "Set your signal, explore a short selection, then react to something real.",
    profile: "My profile",
    steps: ["Signal", "Spark", "Active connections"],
    sparkTitle: "Your sparks",
    sparkIntro: "A short selection based on preferences stated by both people.",
    sparkCount: (count: number) =>
      `${count} profile${count === 1 ? "" : "s"} in this selection`,
    sparkEmptyTitle: "You reached the end of this selection",
    sparkEmptyBody:
      "No endless feed. Adjust your signal or return when new compatible profiles are available.",
    densityLow:
      "There are still few compatible people nearby. A wider radius may help without weakening your essential criteria.",
    editPreferences: "Adjust preferences",
    invite: "Invite someone",
    inviteCopied: "Invitation link copied",
    noSignalTitle: "Activate a signal first",
    noSignalBody: "Embir shows no one until your current intention is clear.",
    retry: "Try again",
    loadError: "This selection could not be loaded.",
    loading: "Preparing your selection…",
    match: "A reciprocal connection was created ✦",
    signalSaved: "Your signal is active.",
    signalRemoved: "Signal deactivated.",
    actionError: "The action could not be saved.",
    authRedirect: "Redirecting to sign in…",
    onboardingRedirect: "Complete your profile before creating a signal.",
  },
  es: {
    free: "Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria.",
    eyebrow: "Connection OS",
    title: "Menos perfiles. Más reciprocidad.",
    subtitle:
      "Elige tu señal, descubre una selección corta y reacciona a algo real.",
    profile: "Mi perfil",
    steps: ["Señal", "Chispa", "Conexiones activas"],
    sparkTitle: "Tus chispas",
    sparkIntro:
      "Una selección corta basada en preferencias declaradas por ambas personas.",
    sparkCount: (count: number) =>
      `${count} perfil${count === 1 ? "" : "es"} en esta selección`,
    sparkEmptyTitle: "Has terminado esta selección",
    sparkEmptyBody:
      "Sin feed infinito. Ajusta tu señal o vuelve cuando haya nuevos perfiles compatibles.",
    densityLow:
      "Todavía hay pocas personas compatibles cerca. Ampliar el radio puede ayudar sin debilitar tus criterios esenciales.",
    editPreferences: "Ajustar preferencias",
    invite: "Invitar a alguien",
    inviteCopied: "Enlace de invitación copiado",
    noSignalTitle: "Activa primero una señal",
    noSignalBody:
      "Embir no muestra a nadie hasta que tu intención actual esté clara.",
    retry: "Reintentar",
    loadError: "No se pudo cargar esta selección.",
    loading: "Preparando tu selección…",
    match: "Se creó una conexión recíproca ✦",
    signalSaved: "Tu señal está activa.",
    signalRemoved: "Señal desactivada.",
    actionError: "No se pudo guardar la acción.",
    authRedirect: "Redirigiendo al inicio de sesión…",
    onboardingRedirect: "Completa tu perfil antes de crear una señal.",
  },
} satisfies Record<SupportedLocale, Record<string, unknown>>;
