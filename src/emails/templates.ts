import {
  assertAdminSignupEmailData,
  assertAggregateReportData,
  assertEmailVerificationEmailData,
  type AdminSignupEmailData,
  type AggregateReportData,
  type EmailVerificationEmailData,
  type QueuedEmailPayload,
} from "../lib/email-core.ts";

const ADMIN_COCKPIT_URL = "https://embir.xyz/admin/analytics";
const EMAIL_LOGO_URL = "https://embir.xyz/brand/embir-email-logo.png";
const ZURICH_TIME_ZONE = "Europe/Zurich";

export interface RenderedEmail {
  html: string;
  text: string;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeCount(value: number): number {
  return Math.max(0, Math.round(Number.isFinite(value) ? value : 0));
}

export function formatZurichDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid email date");
  const parts = new Intl.DateTimeFormat("fr-CH", {
    timeZone: ZURICH_TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;
  const day = part("day");
  const month = part("month");
  const year = part("year");
  const hour = part("hour");
  const minute = part("minute");
  if (!day || !month || !year || !hour || !minute) {
    throw new Error("Unable to localize email date");
  }
  return `${day} ${month} ${year} à ${hour} h ${minute}`;
}

function paragraph(content: string, muted = false): string {
  return `<p style="Margin:0 0 16px 0;color:${muted ? "#f8dbe4" : "#f2ede4"};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:${muted ? "13px" : "16px"};line-height:${muted ? "20px" : "24px"};">${content}</p>`;
}

function heading(content: string): string {
  return `<h2 style="Margin:24px 0 10px 0;color:#f2ede4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:18px;line-height:24px;font-weight:700;">${escapeHtml(content)}</h2>`;
}

function cta(url: string, label: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;Margin:20px 0 18px 0;"><tr><td bgcolor="#f4c7d5" style="background-color:#f4c7d5;border:1px solid #f4c7d5;border-radius:8px;text-align:center;"><a class="embir-cta" href="${escapeHtml(url)}" style="display:inline-block;padding:13px 20px;color:#09060c!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`;
}

function detailsTable(rows: Array<[string, string]>): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#2a1328" style="width:100%;border-collapse:collapse;background-color:#2a1328;border:1px solid #4b1f3d;border-radius:8px;">${rows
    .map(
      ([label, value], index) =>
        `<tr><td width="43%" valign="top" style="width:43%;padding:10px 12px;color:#f8dbe4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;line-height:18px;${index ? "border-top:1px solid #4b1f3d;" : ""}">${escapeHtml(label)}</td><td valign="top" style="padding:10px 12px;color:#f2ede4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;line-height:18px;font-weight:600;word-break:break-word;${index ? "border-top:1px solid #4b1f3d;" : ""}">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;
}

function bulletList(rows: string[]): string {
  return `<ul style="Margin:0 0 16px 0;padding:0 0 0 22px;color:#f2ede4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:23px;">${rows
    .map((row) => `<li style="Margin:0 0 6px 0;">${escapeHtml(row)}</li>`)
    .join("")}</ul>`;
}

function emailShell(input: {
  title: string;
  preheader: string;
  content: string;
  text: string;
  lang?: "fr" | "en" | "es";
}): RenderedEmail {
  const title = escapeHtml(input.title);
  const preheader = escapeHtml(input.preheader);
  const footer = {
    fr: "Des intentions partagées. Des connexions réciproques.",
    en: "Shared intentions. Reciprocal connections.",
    es: "Intenciones compartidas. Conexiones recíprocas.",
  }[input.lang ?? "fr"];
  const html = `<!doctype html>
<html lang="${input.lang ?? "fr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${title}</title>
<style>
:root{color-scheme:dark light;supported-color-schemes:dark light}
@media only screen and (max-width:430px){.embir-outer{padding:12px!important}.embir-content{padding:20px!important}.embir-header{padding:18px 20px!important}.embir-cta{display:block!important}}
</style>
</head>
<body bgcolor="#09060c" style="Margin:0!important;padding:0!important;width:100%!important;background-color:#09060c!important;color:#f2ede4!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none!important;max-height:0;max-width:0;overflow:hidden;color:#09060c;">${preheader}&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#09060c" style="width:100%;border-collapse:collapse;background-color:#09060c!important;">
<tr><td class="embir-outer" align="center" style="padding:20px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#100a12" style="width:100%;max-width:600px;border-collapse:separate;background-color:#100a12!important;border:1px solid #4b1f3d;border-radius:10px;overflow:hidden;">
<tr><td class="embir-header" bgcolor="#2a1328" style="padding:20px 26px;background-color:#2a1328!important;border-bottom:1px solid #4b1f3d;">
<a href="https://embir.xyz" style="display:inline-block;text-decoration:none;"><img src="${EMAIL_LOGO_URL}" width="240" height="72" alt="Embir" style="display:block;width:240px;max-width:100%;height:auto;border:0;color:#f2ede4;font-family:Georgia,serif;font-size:28px;font-weight:700;"></a>
<h1 style="Margin:12px 0 0 0;color:#fff8fa!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:25px;line-height:31px;font-weight:750;">${title}</h1>
</td></tr>
<tr><td class="embir-content" bgcolor="#100a12" style="padding:24px 26px;background-color:#100a12!important;color:#f2ede4!important;">${input.content}</td></tr>
<tr><td bgcolor="#09060c" style="padding:14px 26px;background-color:#09060c!important;border-top:1px solid #4b1f3d;color:#e7a8bc!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;line-height:18px;">Embir · ${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  return {
    html,
    text: `${input.title}\n\n${input.text.trim()}\n\nEmbir — https://embir.xyz`,
  };
}

export const welcomeEmail = (userName: string): RenderedEmail => {
  const safeName = escapeHtml(userName);
  return emailShell({
    title: "Bienvenue sur Embir",
    preheader: "Ton espace Embir est prêt.",
    content: `${paragraph(`Bonjour ${safeName},`)}${paragraph("Ton espace est prêt. Complète ton profil et tes préférences pour découvrir des connexions réciproques.")}${cta("https://embir.xyz/dashboard/profile", "Compléter mon profil")}${paragraph("Embir est une communauté mondiale, inclusive et réservée aux adultes.", true)}`,
    text: `Bonjour ${userName},\n\nTon espace est prêt. Complète ton profil et tes préférences pour découvrir des connexions réciproques.\n\nCompléter mon profil : https://embir.xyz/dashboard/profile\n\nEmbir est une communauté mondiale, inclusive et réservée aux adultes.`,
  });
};

export function emailVerificationEmail(
  userName: string,
  data: EmailVerificationEmailData,
): RenderedEmail {
  assertEmailVerificationEmailData(data);
  const content = {
    fr: {
      title: "Confirme ton email",
      intro: `Bonjour ${userName}, confirme cette adresse pour sécuriser ton compte et rendre ton profil éligible aux connexions Embir.`,
      cta: "Confirmer mon adresse",
      expiry: "Ce lien expire dans 24 heures. Si tu n’as pas créé ce compte, ignore simplement cet email.",
    },
    en: {
      title: "Confirm your email",
      intro: `Hi ${userName}, confirm this address to secure your account and make your profile eligible for Embir connections.`,
      cta: "Confirm my address",
      expiry: "This link expires in 24 hours. If you did not create this account, simply ignore this email.",
    },
    es: {
      title: "Confirma tu email",
      intro: `Hola ${userName}, confirma esta dirección para proteger tu cuenta y hacer que tu perfil sea elegible para las conexiones de Embir.`,
      cta: "Confirmar mi dirección",
      expiry: "Este enlace caduca en 24 horas. Si no creaste esta cuenta, ignora este email.",
    },
  }[data.locale];
  return emailShell({
    title: content.title,
    preheader: content.expiry,
    lang: data.locale,
    content: `${paragraph(escapeHtml(content.intro))}${cta(data.verificationUrl, content.cta)}${paragraph(escapeHtml(content.expiry), true)}`,
    text: `${content.intro}\n\n${content.cta} : ${data.verificationUrl}\n\n${content.expiry}`,
  });
}

export const profileReminderEmail = (
  userName: string,
  completionPercent: number,
): RenderedEmail => {
  const safePercent = Math.max(0, Math.min(100, Math.round(completionPercent)));
  return emailShell({
    title: "Ton profil Embir t’attend",
    preheader: `Ton profil est complété à ${safePercent} %.`,
    content: `${paragraph(`Bonjour ${escapeHtml(userName)},`)}${paragraph(`Ton profil est complété à <strong style="color:#fff8fa;">${safePercent} %</strong>.`)}${cta("https://embir.xyz/dashboard/profile", "Continuer mon profil")}`,
    text: `Bonjour ${userName},\n\nTon profil est complété à ${safePercent} %.\n\nContinuer mon profil : https://embir.xyz/dashboard/profile`,
  });
};

export const weeklyDigestEmail = (
  userName: string,
  newMatches: number,
  topArticles: Array<{ title: string; url: string }>,
): RenderedEmail => {
  const safeArticles = topArticles.slice(0, 5).filter((article) => {
    try {
      const url = new URL(article.url);
      return (
        url.protocol === "https:" &&
        (url.hostname === "embir.xyz" || url.hostname.endsWith(".embir.xyz"))
      );
    } catch {
      return false;
    }
  });
  const articleHtml = safeArticles.length
    ? `<ul style="Margin:0 0 16px 0;padding:0 0 0 22px;color:#f2ede4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:23px;">${safeArticles
        .map(
          (article) =>
            `<li style="Margin:0 0 7px 0;"><a href="${escapeHtml(article.url)}" style="color:#e7a8bc!important;text-decoration:underline;">${escapeHtml(article.title)}</a></li>`,
        )
        .join("")}</ul>`
    : "";
  const articleText = safeArticles
    .map((article) => `- ${article.title} : ${article.url}`)
    .join("\n");
  const matches = safeCount(newMatches);
  return emailShell({
    title: "Ton récapitulatif Embir",
    preheader: `${matches} nouvelle(s) connexion(s) cette semaine.`,
    content: `${paragraph(`Bonjour ${escapeHtml(userName)},`)}${paragraph(`<strong style="color:#fff8fa;">${matches}</strong> nouvelle(s) connexion(s) cette semaine.`)}${articleHtml}${cta("https://embir.xyz/dashboard", "Ouvrir Embir")}`,
    text: `Bonjour ${userName},\n\n${matches} nouvelle(s) connexion(s) cette semaine.${articleText ? `\n\n${articleText}` : ""}\n\nOuvrir Embir : https://embir.xyz/dashboard`,
  });
};

function reportList(
  title: string,
  rows?: Array<{ label: string; count: number }>,
): { html: string; text: string } {
  if (!rows?.length) return { html: "", text: "" };
  const values = rows.map((row) => `${row.label} — ${safeCount(row.count)}`);
  return {
    html: `${heading(title)}${bulletList(values)}`,
    text: `${title}\n${values.map((row) => `- ${row}`).join("\n")}`,
  };
}

function reportTextList(title: string, rows?: string[]): { html: string; text: string } {
  if (!rows?.length) return { html: "", text: "" };
  return {
    html: `${heading(title)}${bulletList(rows)}`,
    text: `${title}\n${rows.map((row) => `- ${row}`).join("\n")}`,
  };
}

export function adminAggregateReportEmail(report: AggregateReportData): RenderedEmail {
  assertAggregateReportData(report);
  const cadence = report.cadence === "daily" ? "quotidien" : "hebdomadaire";
  const metrics: Array<[string, string]> = [
    ["Inscriptions", String(report.newUsers)],
    ["Présences actives", String(report.activePresenceSignals)],
    ["Matchs mutuels", String(report.mutualMatches)],
    ["Messages", String(report.messagesSent)],
    ["Signalements", String(report.reportsCreated)],
    ["Événements analytics", String(report.analyticsEvents)],
    ["Emails envoyés", String(report.emailsSent)],
    ["Emails en attente", String(report.emailsPending)],
    ["Emails échoués", String(report.emailsFailed)],
  ];
  if (report.uniqueVisitors !== undefined) metrics.unshift(["Visiteurs uniques", String(report.uniqueVisitors)]);
  if (report.sessions !== undefined) metrics.push(["Sessions", String(report.sessions)]);
  if (report.pageViews !== undefined) metrics.push(["Pages vues", String(report.pageViews)]);
  if (report.totalUsers !== undefined) metrics.push(["Utilisateurs totaux", String(report.totalUsers)]);
  if (report.completedProfiles !== undefined) metrics.push(["Profils complétés", String(report.completedProfiles)]);
  if (report.activeUsers !== undefined) metrics.push(["Utilisateurs actifs", String(report.activeUsers)]);
  if (report.health) {
    metrics.push(
      ["Jobs échoués (24 h)", String(report.health.failedJobs24h)],
      ["Jobs bloqués", String(report.health.staleJobs)],
      ["Emails bloqués", String(report.health.stuckEmails)],
      ["File email", String(report.health.outboxBacklog)],
      ["Erreurs API (24 h)", String(report.health.apiErrors24h)],
      ["Jours avant purge", String(report.health.unaggregatedRetentionDays)],
    );
    if (report.health.trackingLagMinutes !== null) {
      metrics.push(["Retard tracking (min)", String(report.health.trackingLagMinutes)]);
    }
  }
  const sections = [
    reportList("Sources", report.topSources),
    reportList("Pages d’entrée", report.topPages),
    reportList("Pays (seuil de confidentialité)", report.topCountries),
    reportList("Langues", report.topLanguages),
    reportTextList("Alertes", report.alerts),
    reportTextList("Recommandations", report.recommendations),
    reportTextList("Trois priorités", report.priorities),
  ];
  const period = `${formatZurichDateTime(report.periodStart)} → ${formatZurichDateTime(report.periodEnd)}`;
  const extraHtml = `${report.visitToSignupRate !== undefined ? paragraph(`<strong style="color:#fff8fa;">Conversion visite → inscription :</strong> ${report.visitToSignupRate} %`) : ""}${report.retentionD1 !== undefined ? paragraph(`<strong style="color:#fff8fa;">Rétention :</strong> D1 ${report.retentionD1} % · D7 ${report.retentionD7 ?? 0} % · D30 ${report.retentionD30 ?? 0} %`) : ""}`;
  const extraText = `${report.visitToSignupRate !== undefined ? `\nConversion visite → inscription : ${report.visitToSignupRate} %` : ""}${report.retentionD1 !== undefined ? `\nRétention : D1 ${report.retentionD1} % · D7 ${report.retentionD7 ?? 0} % · D30 ${report.retentionD30 ?? 0} %` : ""}`;
  return emailShell({
    title: `Rapport ${cadence} Embir`,
    preheader: `Synthèse opérationnelle Embir — ${period}`,
    content: `${paragraph(`Période Europe/Zurich : ${escapeHtml(period)}`, true)}${detailsTable(metrics)}${extraHtml}${sections.map((section) => section.html).join("")}${cta(ADMIN_COCKPIT_URL, "Voir le cockpit Embir")}${paragraph("Rapport strictement agrégé : aucune adresse, aucun message et aucun identifiant utilisateur.", true)}`,
    text: `Période Europe/Zurich : ${period}\n\n${metrics.map(([label, value]) => `${label} : ${value}`).join("\n")}${extraText}\n\n${sections.map((section) => section.text).filter(Boolean).join("\n\n")}\n\nVoir le cockpit Embir : ${ADMIN_COCKPIT_URL}\n\nRapport strictement agrégé : aucune adresse, aucun message et aucun identifiant utilisateur.`,
  });
}

function optionalValue(value: string | null | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized || fallback;
}

export function adminSignupEmail(signup: AdminSignupEmailData): RenderedEmail {
  assertAdminSignupEmailData(signup);
  const localDate = formatZurichDateTime(signup.occurredAt);
  const qualifiedMembers = signup.qualifiedMembers === undefined
    ? "Non disponible"
    : String(signup.qualifiedMembers);
  const growth24h = signup.growth24h === undefined
    ? "Non disponible"
    : `${signup.growth24h > 0 ? "+" : ""}${signup.growth24h}`;
  const rows: Array<[string, string]> = [
    ["Date et heure", localDate],
    ["Langue", optionalValue(signup.language, "Non renseignée")],
    ["Source d’acquisition", optionalValue(signup.source, "Direct")],
    ["Campagne UTM", optionalValue(signup.campaign, "Aucune")],
    ["Zone générale", optionalValue(signup.country, "Non renseignée")],
    ["Onboarding", signup.onboardingStatus === "completed" ? "Terminé" : "Commencé"],
    ["Inscriptions externes réelles", String(signup.totalUsers)],
    ["Membres qualifiés", qualifiedMembers],
    ["Évolution sur 24 heures", growth24h],
  ];
  return emailShell({
    title: "Nouvelle inscription",
    preheader: "Une nouvelle personne vient de s’inscrire sur Embir.",
    content: `${paragraph("Une nouvelle personne vient de s’inscrire sur Embir.")}${detailsTable(rows)}${cta(ADMIN_COCKPIT_URL, "Voir le cockpit Embir")}${paragraph("Aucune adresse, localisation exacte, orientation, token ou donnée privée n’est incluse.", true)}`,
    text: `Une nouvelle personne vient de s’inscrire sur Embir.\n\n${rows.map(([label, value]) => `${label} : ${value}`).join("\n")}\n\nVoir le cockpit Embir : ${ADMIN_COCKPIT_URL}\n\nAucune adresse, localisation exacte, orientation, token ou donnée privée n’est incluse.`,
  });
}

export function renderQueuedEmail(
  payload: QueuedEmailPayload,
  displayName = "toi",
): RenderedEmail {
  if (payload.template === "email-verification") {
    assertEmailVerificationEmailData(payload.data);
    return emailVerificationEmail(displayName, payload.data);
  }
  if (payload.template === "welcome") return welcomeEmail(displayName);
  const templateData = payload.data as Record<string, unknown>;
  if (payload.template === "admin-signup") {
    assertAdminSignupEmailData(payload.data);
    return adminSignupEmail(payload.data);
  }
  if (payload.template === "profile-reminder") {
    return profileReminderEmail(displayName, Number(templateData.completionPercent ?? 0));
  }
  if (payload.template === "weekly-digest") {
    const topArticles = Array.isArray(templateData.topArticles)
      ? templateData.topArticles.filter(
          (article: unknown): article is { title: string; url: string } =>
            !!article &&
            typeof article === "object" &&
            typeof (article as { title?: unknown }).title === "string" &&
            typeof (article as { url?: unknown }).url === "string",
        )
      : [];
    return weeklyDigestEmail(displayName, Number(templateData.newMatches ?? 0), topArticles);
  }
  assertAggregateReportData(payload.data);
  return adminAggregateReportEmail(payload.data);
}
