import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  adminAggregateReportEmail,
  adminSignupEmail,
  emailVerificationEmail,
  profileReminderEmail,
  weeklyDigestEmail,
  welcomeEmail,
  type RenderedEmail,
} from "../src/emails/templates.ts";
import type { AggregateReportData } from "../src/lib/email-core.ts";

const projectRoot = path.resolve(path.dirname(path.resolve(process.argv[1])), "..");
const outputDirectory = path.join(projectRoot, "artifacts", "email-previews");

interface PreviewFixture {
  name: string;
  description: string;
  render: () => RenderedEmail;
}

const aggregateBase: Omit<AggregateReportData, "cadence" | "periodStart" | "periodEnd"> = {
  newUsers: 18,
  activePresenceSignals: 284,
  mutualMatches: 37,
  messagesSent: 143,
  reportsCreated: 1,
  analyticsEvents: 1_842,
  emailsSent: 72,
  emailsPending: 2,
  emailsFailed: 0,
  uniqueVisitors: 731,
  sessions: 912,
  pageViews: 2_804,
  totalUsers: 2_526,
  completedProfiles: 1_847,
  activeUsers: 604,
  visitToSignupRate: 2.46,
  previousVisitors: 694,
  previousNewUsers: 15,
  sevenDayAverageVisitors: 688,
  retentionD1: 61.4,
  retentionD7: 38.2,
  retentionD30: 24.8,
  topSources: [
    { label: "Reddit", count: 287 },
    { label: "Recherche organique", count: 214 },
    { label: "Direct", count: 153 },
  ],
  topPages: [
    { label: "/fr", count: 326 },
    { label: "/fr/auth/register", count: 141 },
    { label: "/en", count: 93 },
  ],
  topCountries: [
    { label: "Suisse", count: 184 },
    { label: "France", count: 173 },
    { label: "Belgique", count: 61 },
  ],
  topLanguages: [
    { label: "fr", count: 392 },
    { label: "en", count: 247 },
    { label: "es", count: 92 },
  ],
  alerts: ["Aucune erreur critique au cours de la période."],
  recommendations: ["Maintenir le suivi des inscriptions externes réelles."],
  priorities: [
    "Répondre aux retours des nouveaux membres.",
    "Surveiller la délivrabilité des emails.",
    "Comparer la conversion par source d’acquisition.",
  ],
  health: {
    failedJobs24h: 0,
    staleJobs: 0,
    stuckEmails: 0,
    outboxBacklog: 2,
    apiErrors24h: 0,
    trackingLagMinutes: 3,
    unaggregatedRetentionDays: 28,
  },
};

const fixtures: PreviewFixture[] = [
  {
    name: "welcome",
    description: "Email de bienvenue utilisateur",
    render: () => welcomeEmail("Éléane"),
  },
  {
    name: "email-verification",
    description: "Vérification d’adresse email",
    render: () =>
      emailVerificationEmail("Éléane", {
        locale: "fr",
        expiresAt: "2026-07-16T16:53:39.719Z",
        verificationUrl:
          "https://embir.xyz/fr/auth/verify-email#token=preview-only-not-a-secret",
      }),
  },
  {
    name: "profile-reminder",
    description: "Rappel de profil incomplet",
    render: () => profileReminderEmail("Éléane", 68),
  },
  {
    name: "weekly-digest",
    description: "Récapitulatif hebdomadaire utilisateur",
    render: () =>
      weeklyDigestEmail("Éléane", 7, [
        {
          title: "Créer un profil qui te ressemble vraiment",
          url: "https://embir.xyz/fr/guides/profil-authentique",
        },
        {
          title: "Pourquoi la réciprocité change les rencontres",
          url: "https://embir.xyz/fr/blog/reciprocite",
        },
      ]),
  },
  {
    name: "admin-aggregate-daily",
    description: "Rapport opérationnel quotidien",
    render: () =>
      adminAggregateReportEmail({
        ...aggregateBase,
        cadence: "daily",
        periodStart: "2026-07-14T00:00:00.000Z",
        periodEnd: "2026-07-15T00:00:00.000Z",
      }),
  },
  {
    name: "admin-aggregate-weekly",
    description: "Rapport opérationnel hebdomadaire",
    render: () =>
      adminAggregateReportEmail({
        ...aggregateBase,
        cadence: "weekly",
        periodStart: "2026-07-08T00:00:00.000Z",
        periodEnd: "2026-07-15T00:00:00.000Z",
        newUsers: 106,
        uniqueVisitors: 4_862,
        sessions: 6_094,
        pageViews: 18_604,
        emailsSent: 493,
      }),
  },
  {
    name: "admin-signup",
    description: "Notification d’une nouvelle inscription",
    render: () =>
      adminSignupEmail({
        occurredAt: "2026-07-14T16:53:39.719Z",
        country: "CH",
        language: "fr",
        source: "Reddit",
        campaign: "beta-juillet-2026",
        onboardingStatus: "completed",
        totalUsers: 26,
        qualifiedMembers: 19,
        growth24h: 4,
      }),
  },
  {
    name: "admin-signup-missing-values",
    description: "Notification d’inscription avec valeurs optionnelles absentes",
    render: () =>
      adminSignupEmail({
        occurredAt: "2026-07-14T16:53:39.719Z",
        country: null,
        language: "fr",
        source: null,
        campaign: null,
        onboardingStatus: "started",
        totalUsers: 26,
      }),
  },
];

async function main(): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });

  const manifest = [];
  for (const fixture of fixtures) {
    const rendered = fixture.render();
    if (!rendered.html.trim() || !rendered.text.trim()) {
      throw new Error(`Preview ${fixture.name} is missing its HTML or text version`);
    }
    const htmlFile = `${fixture.name}.html`;
    const textFile = `${fixture.name}.txt`;
    await Promise.all([
      writeFile(path.join(outputDirectory, htmlFile), rendered.html, "utf8"),
      writeFile(path.join(outputDirectory, textFile), `${rendered.text.trim()}\n`, "utf8"),
    ]);
    manifest.push({
      name: fixture.name,
      description: fixture.description,
      htmlFile,
      textFile,
    });
  }

  await writeFile(
    path.join(outputDirectory, "manifest.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), fixtures: manifest }, null, 2)}\n`,
    "utf8",
  );

  console.log(`Generated ${fixtures.length} email previews in ${outputDirectory}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
