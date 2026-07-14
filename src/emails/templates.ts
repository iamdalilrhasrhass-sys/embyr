import {
  assertAdminSignupEmailData,
  assertAggregateReportData,
  assertEmailVerificationEmailData,
  type AggregateReportData,
  type EmailVerificationEmailData,
  type QueuedEmailPayload,
} from "../lib/email-core.ts";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailShell(title: string, content: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<style>
body{margin:0;background:#09050f;color:#f8f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6}
.container{max-width:620px;margin:0 auto;padding:28px 18px}.card{background:#130a1d;border:1px solid #2d1b3d;border-radius:22px;overflow:hidden}
.header{padding:28px;background:linear-gradient(135deg,#ff1f5a,#ff5e36,#d4a574);color:#130a1d}.content{padding:30px}
.cta{display:inline-block;background:#d4a574;color:#130a1d!important;padding:12px 22px;text-decoration:none;border-radius:999px;font-weight:700}
.metric{display:inline-block;min-width:120px;margin:5px;padding:12px;background:#1d1129;border-radius:14px}.muted{color:#b9a9c7;font-size:13px}
</style></head><body><div class="container"><div class="card"><div class="header"><h1>${escapeHtml(title)}</h1></div><div class="content">${content}</div></div></div></body></html>`;
}

export const welcomeEmail = (userName: string): string =>
  emailShell(
    "Bienvenue sur Embir",
    `<p>Bonjour ${escapeHtml(userName)},</p><p>Ton espace est prêt. Complète ton profil et tes préférences pour découvrir des connexions réciproques.</p><p><a href="https://embir.xyz/dashboard/profile" class="cta">Compléter mon profil</a></p><p class="muted">Embir est une communauté mondiale, inclusive et réservée aux adultes.</p>`,
  );

export function emailVerificationEmail(
  userName: string,
  data: EmailVerificationEmailData,
): string {
  assertEmailVerificationEmailData(data);
  const content = {
    fr: {
      title: "Confirme ton email",
      intro: `Bonjour ${escapeHtml(userName)}, confirme cette adresse pour sécuriser ton compte et rendre ton profil éligible aux connexions Embir.`,
      cta: "Confirmer mon adresse",
      expiry: "Ce lien expire dans 24 heures. Si tu n’as pas créé ce compte, ignore simplement cet email.",
    },
    en: {
      title: "Confirm your email",
      intro: `Hi ${escapeHtml(userName)}, confirm this address to secure your account and make your profile eligible for Embir connections.`,
      cta: "Confirm my address",
      expiry: "This link expires in 24 hours. If you did not create this account, simply ignore this email.",
    },
    es: {
      title: "Confirma tu email",
      intro: `Hola ${escapeHtml(userName)}, confirma esta dirección para proteger tu cuenta y hacer que tu perfil sea elegible para las conexiones de Embir.`,
      cta: "Confirmar mi dirección",
      expiry: "Este enlace caduca en 24 horas. Si no creaste esta cuenta, ignora este email.",
    },
  }[data.locale];
  return emailShell(
    content.title,
    `<p>${content.intro}</p><p><a href="${escapeHtml(data.verificationUrl)}" class="cta">${content.cta}</a></p><p class="muted">${content.expiry}</p>`,
  );
}

export const profileReminderEmail = (
  userName: string,
  completionPercent: number,
): string => {
  const safePercent = Math.max(0, Math.min(100, Math.round(completionPercent)));
  return emailShell(
    "Ton profil Embir t’attend",
    `<p>Bonjour ${escapeHtml(userName)},</p><p>Ton profil est complété à <strong>${safePercent}%</strong>.</p><p><a href="https://embir.xyz/dashboard/profile" class="cta">Continuer mon profil</a></p>`,
  );
};

export const weeklyDigestEmail = (
  userName: string,
  newMatches: number,
  topArticles: Array<{ title: string; url: string }>,
): string => {
  const articleHtml = topArticles
    .slice(0, 5)
    .filter((article) => {
      try {
        const url = new URL(article.url);
        return (
          url.protocol === "https:" &&
          (url.hostname === "embir.xyz" || url.hostname.endsWith(".embir.xyz"))
        );
      } catch {
        return false;
      }
    })
    .map(
      (article) =>
        `<li><a href="${escapeHtml(article.url)}">${escapeHtml(article.title)}</a></li>`,
    )
    .join("");
  return emailShell(
    "Ton récapitulatif Embir",
    `<p>Bonjour ${escapeHtml(userName)},</p><p><strong>${Math.max(0, Math.round(newMatches))}</strong> nouvelle(s) connexion(s) cette semaine.</p>${articleHtml ? `<ul>${articleHtml}</ul>` : ""}<p><a href="https://embir.xyz/dashboard" class="cta">Ouvrir Embir</a></p>`,
  );
};

export function adminAggregateReportEmail(report: AggregateReportData): string {
  assertAggregateReportData(report);
  const metrics: Array<[string, number]> = [
    ["Inscriptions", report.newUsers],
    ["Présences actives", report.activePresenceSignals],
    ["Matchs mutuels", report.mutualMatches],
    ["Messages", report.messagesSent],
    ["Signalements", report.reportsCreated],
    ["Événements analytics", report.analyticsEvents],
    ["Emails envoyés", report.emailsSent],
    ["Emails en attente", report.emailsPending],
    ["Emails échoués", report.emailsFailed],
  ];
  if (report.uniqueVisitors !== undefined) metrics.unshift(["Visiteurs uniques", report.uniqueVisitors]);
  if (report.sessions !== undefined) metrics.push(["Sessions", report.sessions]);
  if (report.pageViews !== undefined) metrics.push(["Pages vues", report.pageViews]);
  if (report.totalUsers !== undefined) metrics.push(["Utilisateurs totaux", report.totalUsers]);
  if (report.completedProfiles !== undefined) metrics.push(["Profils complétés", report.completedProfiles]);
  if (report.activeUsers !== undefined) metrics.push(["Utilisateurs actifs", report.activeUsers]);
  if (report.health) {
    metrics.push(
      ["Jobs échoués (24 h)", report.health.failedJobs24h],
      ["Jobs bloqués", report.health.staleJobs],
      ["Emails bloqués", report.health.stuckEmails],
      ["File email", report.health.outboxBacklog],
      ["Erreurs API (24 h)", report.health.apiErrors24h],
      ["Jours à agréger avant purge", report.health.unaggregatedRetentionDays],
    );
    if (report.health.trackingLagMinutes !== null) {
      metrics.push(["Retard tracking (min)", report.health.trackingLagMinutes]);
    }
  }
  const list = (title: string, rows?: Array<{ label: string; count: number }>) =>
    rows?.length
      ? `<h2>${escapeHtml(title)}</h2><ul>${rows.map((row) => `<li>${escapeHtml(row.label)} — ${row.count}</li>`).join("")}</ul>`
      : "";
  const textList = (title: string, rows?: string[]) =>
    rows?.length ? `<h2>${escapeHtml(title)}</h2><ul>${rows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>` : "";
  return emailShell(
    `Rapport Embir ${report.cadence}`,
    `<p class="muted">Période UTC : ${escapeHtml(report.periodStart)} → ${escapeHtml(report.periodEnd)}</p><div>${metrics
      .map(
        ([label, value]) =>
          `<div class="metric"><strong>${value}</strong><br><span class="muted">${escapeHtml(label)}</span></div>`,
      )
      .join("")}</div>${report.visitToSignupRate !== undefined ? `<p><strong>Conversion visite → inscription :</strong> ${report.visitToSignupRate}%</p>` : ""}${report.retentionD1 !== undefined ? `<p><strong>Rétention :</strong> D1 ${report.retentionD1}% · D7 ${report.retentionD7}% · D30 ${report.retentionD30}%</p>` : ""}${list("Sources", report.topSources)}${list("Pages d’entrée", report.topPages)}${list("Pays (seuil de confidentialité)", report.topCountries)}${list("Langues", report.topLanguages)}${textList("Alertes", report.alerts)}${textList("Recommandations", report.recommendations)}${textList("Trois priorités", report.priorities)}<p class="muted">Rapport strictement agrégé : aucune adresse, aucun message et aucun identifiant utilisateur.</p>`,
  );
}

export function renderQueuedEmail(
  payload: QueuedEmailPayload,
  displayName = "toi",
): string {
  if (payload.template === "email-verification") {
    assertEmailVerificationEmailData(payload.data);
    return emailVerificationEmail(displayName, payload.data);
  }
  if (payload.template === "welcome") return welcomeEmail(displayName);
  const templateData = payload.data as Record<string, unknown>;
  if (payload.template === "admin-signup") {
    assertAdminSignupEmailData(payload.data);
    const signup = payload.data;
    return emailShell(
      "Nouvelle inscription Embir",
      `<p><strong>Date :</strong> ${escapeHtml(signup.occurredAt)}</p><p><strong>Pays/zone :</strong> ${escapeHtml(signup.country || "non renseigné")}</p><p><strong>Langue :</strong> ${escapeHtml(signup.language)}</p><p><strong>Source :</strong> ${escapeHtml(signup.source || "direct")}</p><p><strong>Campagne :</strong> ${escapeHtml(signup.campaign || "aucune")}</p><p><strong>Onboarding :</strong> ${escapeHtml(signup.onboardingStatus)}</p><p><strong>Total utilisateurs :</strong> ${signup.totalUsers}</p><p class="muted">Aucune adresse, orientation, position précise, token ou donnée privée n’est incluse.</p>`,
    );
  }
  if (payload.template === "profile-reminder") {
    const completionPercent = Number(templateData.completionPercent ?? 0);
    return profileReminderEmail(displayName, completionPercent);
  }
  if (payload.template === "weekly-digest") {
    const newMatches = Number(templateData.newMatches ?? 0);
    const topArticles = Array.isArray(templateData.topArticles)
      ? templateData.topArticles.filter(
          (article: unknown): article is { title: string; url: string } =>
            !!article &&
            typeof article === "object" &&
            typeof (article as { title?: unknown }).title === "string" &&
            typeof (article as { url?: unknown }).url === "string",
        )
      : [];
    return weeklyDigestEmail(displayName, newMatches, topArticles);
  }
  assertAggregateReportData(payload.data);
  return adminAggregateReportEmail(payload.data);
}
