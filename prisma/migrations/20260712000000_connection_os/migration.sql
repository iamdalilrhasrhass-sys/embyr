-- CreateEnum
CREATE TYPE "SexualOrientation" AS ENUM ('HETERO', 'HOMOSEXUEL', 'LESBIENNE', 'BI', 'QUEER', 'PAN', 'FLUIDE', 'DEMI', 'ASEXUEL', 'AUTRE');

-- CreateEnum
CREATE TYPE "ConnectionIntent" AS ENUM ('AMOUR', 'AMIS', 'FUN', 'PLAN_CUL', 'SPORT', 'EVENEMENTS', 'DISCUSSION', 'AUTRE');

-- CreateEnum
CREATE TYPE "SocialEnergy" AS ENUM ('CALME', 'OUVERTE', 'SPONTANEE');

-- CreateEnum
CREATE TYPE "SignalFormat" AS ENUM ('DISCUSSION', 'CAFE', 'BALADE', 'SPORT', 'SORTIE', 'ACTIVITE', 'AUTRE');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'MEMBERS', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ProfileModerationState" AS ENUM ('ACTIVE', 'REVIEW', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ConnectionMode" AS ENUM ('SOLO', 'NIGHT', 'DUO', 'CIRCLE');

-- CreateEnum
CREATE TYPE "ConnectionState" AS ENUM ('ELIGIBLE', 'EXPOSED', 'SIGNAL_SENT', 'RECIPROCAL', 'REVEAL_PENDING', 'REVEAL_COMPLETED', 'CONVERSATION', 'PLAN_PROPOSED', 'PLAN_CONFIRMED', 'MET', 'CONTINUE', 'FRIENDS', 'PAUSED', 'CLOSED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ContextualTargetType" AS ENUM ('PHOTO', 'PROMPT', 'ACTIVITY', 'VOICE', 'PROFILE_DETAIL');

-- CreateEnum
CREATE TYPE "RevealKind" AS ENUM ('TEXT', 'VOICE', 'VISUAL_CHOICE', 'VALUE', 'ANECDOTE');

-- CreateEnum
CREATE TYPE "MeetingPlanStatus" AS ENUM ('PROPOSED', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PrivateOutcome" AS ENUM ('CONTINUE', 'FRIENDS', 'PAUSE', 'CLOSE', 'REPORT');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED', 'SKIPPED');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "acceptedIntents" "ConnectionIntent"[] DEFAULT ARRAY[]::"ConnectionIntent"[],
ADD COLUMN     "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "moderationState" "ProfileModerationState" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "onboardingVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "orientation" "SexualOrientation",
ADD COLUMN     "primaryIntent" "ConnectionIntent",
ADD COLUMN     "seekingAgeMax" INTEGER,
ADD COLUMN     "seekingAgeMin" INTEGER,
ADD COLUMN     "seekingGenders" "GenderIdentity"[] DEFAULT ARRAY[]::"GenderIdentity"[],
ADD COLUMN     "seekingRadiusKm" INTEGER,
ADD COLUMN     "visibilityStatus" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "matchId" TEXT;

-- AlterTable
ALTER TABLE "FeatureFlag" ADD COLUMN     "cities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cohorts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "config" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "environments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rolloutPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "testUserIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "lastTransitionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "matchedAt" TIMESTAMP(3),
ADD COLUMN     "mode" "ConnectionMode" NOT NULL DEFAULT 'SOLO',
ADD COLUMN     "state" "ConnectionState" NOT NULL DEFAULT 'ELIGIBLE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN     "anonymousId" TEXT,
ADD COLUMN     "campaign" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "deviceCategory" TEXT,
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "eventVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "environment" TEXT NOT NULL DEFAULT 'production',
ADD COLUMN     "lastAttemptAt" TIMESTAMP(3),
ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "nextAttemptAt" TIMESTAMP(3),
ADD COLUMN     "payload" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "providerMessageId" TEXT,
ADD COLUMN     "recipientHash" TEXT,
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- Backfill before enforcing NOT NULL so legacy EmailLog rows migrate safely.
UPDATE "EmailLog" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
ALTER TABLE "EmailLog" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "PresenceSignal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intent" "ConnectionIntent" NOT NULL,
    "socialEnergy" "SocialEnergy" NOT NULL,
    "formats" "SignalFormat"[] DEFAULT ARRAY[]::"SignalFormat"[],
    "availabilityText" TEXT,
    "approximateArea" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresenceSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileExposure" (
    "id" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "selectionId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "reasonCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "exposedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileExposure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextualSignal" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "targetType" "ContextualTargetType" NOT NULL,
    "targetId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContextualSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionEvent" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "actorId" TEXT,
    "fromState" "ConnectionState",
    "toState" "ConnectionState" NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionReveal" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "kind" "RevealKind" NOT NULL DEFAULT 'TEXT',
    "prompt" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionReveal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevealResponse" (
    "id" TEXT NOT NULL,
    "revealId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevealResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatePlan" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "proposerId" TEXT NOT NULL,
    "proposedAt" TIMESTAMP(3) NOT NULL,
    "format" "SignalFormat" NOT NULL,
    "publicPlace" TEXT,
    "approximateArea" TEXT,
    "status" "MeetingPlanStatus" NOT NULL DEFAULT 'PROPOSED',
    "acceptedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "safetySharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionOutcome" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outcome" "PrivateOutcome" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NightSession" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "maxIntroductions" INTEGER NOT NULL DEFAULT 3,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NightSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NightEnrollment" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NightEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRun" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "processedCount" INTEGER NOT NULL DEFAULT 0,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "error" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "JobRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAggregate" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyAggregate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PresenceSignal_userId_active_expiresAt_idx" ON "PresenceSignal"("userId", "active", "expiresAt");

-- CreateIndex
CREATE INDEX "PresenceSignal_active_expiresAt_idx" ON "PresenceSignal"("active", "expiresAt");

-- CreateIndex
CREATE INDEX "PresenceSignal_intent_active_expiresAt_idx" ON "PresenceSignal"("intent", "active", "expiresAt");

-- CreateIndex
CREATE INDEX "ProfileExposure_viewerId_exposedAt_idx" ON "ProfileExposure"("viewerId", "exposedAt");

-- CreateIndex
CREATE INDEX "ProfileExposure_candidateId_exposedAt_idx" ON "ProfileExposure"("candidateId", "exposedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileExposure_viewerId_candidateId_selectionId_key" ON "ProfileExposure"("viewerId", "candidateId", "selectionId");

-- CreateIndex
CREATE INDEX "ContextualSignal_recipientId_createdAt_idx" ON "ContextualSignal"("recipientId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContextualSignal_matchId_senderId_key" ON "ContextualSignal"("matchId", "senderId");

-- CreateIndex
CREATE INDEX "ConnectionEvent_matchId_createdAt_idx" ON "ConnectionEvent"("matchId", "createdAt");

-- CreateIndex
CREATE INDEX "ConnectionReveal_matchId_createdAt_idx" ON "ConnectionReveal"("matchId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RevealResponse_revealId_userId_key" ON "RevealResponse"("revealId", "userId");

-- CreateIndex
CREATE INDEX "DatePlan_matchId_status_idx" ON "DatePlan"("matchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionOutcome_matchId_userId_key" ON "ConnectionOutcome"("matchId", "userId");

-- CreateIndex
CREATE INDEX "NightSession_city_startsAt_idx" ON "NightSession"("city", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "NightEnrollment_sessionId_userId_key" ON "NightEnrollment"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobRun_idempotencyKey_key" ON "JobRun"("idempotencyKey");

-- CreateIndex
CREATE INDEX "JobRun_jobName_startedAt_idx" ON "JobRun"("jobName", "startedAt");

-- CreateIndex
CREATE INDEX "JobRun_status_startedAt_idx" ON "JobRun"("status", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAggregate_day_key" ON "DailyAggregate"("day");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_matchId_key" ON "Conversation"("matchId");

-- CreateIndex
CREATE INDEX "Conversation_user1Id_user2Id_idx" ON "Conversation"("user1Id", "user2Id");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_receiverId_status_createdAt_idx" ON "Message"("receiverId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Block_blockedId_idx" ON "Block"("blockedId");

-- CreateIndex
CREATE INDEX "Match_user1Id_state_updatedAt_idx" ON "Match"("user1Id", "state", "updatedAt");

-- CreateIndex
CREATE INDEX "Match_user2Id_state_updatedAt_idx" ON "Match"("user2Id", "state", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");

-- CreateIndex
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_deliveryStatus_createdAt_idx" ON "Notification"("deliveryStatus", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsEvent_eventId_key" ON "AnalyticsEvent"("eventId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_eventName_occurredAt_idx" ON "AnalyticsEvent"("userId", "eventName", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_occurredAt_idx" ON "AnalyticsEvent"("sessionId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_occurredAt_idx" ON "AnalyticsEvent"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_dedupeKey_key" ON "EmailLog"("dedupeKey");

-- CreateIndex
CREATE INDEX "EmailLog_status_nextAttemptAt_idx" ON "EmailLog"("status", "nextAttemptAt");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresenceSignal" ADD CONSTRAINT "PresenceSignal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileExposure" ADD CONSTRAINT "ProfileExposure_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileExposure" ADD CONSTRAINT "ProfileExposure_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextualSignal" ADD CONSTRAINT "ContextualSignal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextualSignal" ADD CONSTRAINT "ContextualSignal_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextualSignal" ADD CONSTRAINT "ContextualSignal_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionEvent" ADD CONSTRAINT "ConnectionEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionEvent" ADD CONSTRAINT "ConnectionEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionReveal" ADD CONSTRAINT "ConnectionReveal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealResponse" ADD CONSTRAINT "RevealResponse_revealId_fkey" FOREIGN KEY ("revealId") REFERENCES "ConnectionReveal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealResponse" ADD CONSTRAINT "RevealResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatePlan" ADD CONSTRAINT "DatePlan_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatePlan" ADD CONSTRAINT "DatePlan_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionOutcome" ADD CONSTRAINT "ConnectionOutcome_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionOutcome" ADD CONSTRAINT "ConnectionOutcome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NightEnrollment" ADD CONSTRAINT "NightEnrollment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "NightSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NightEnrollment" ADD CONSTRAINT "NightEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill legacy rows without inferring sensitive profile preferences.
UPDATE "Match"
SET "state" = CASE
  WHEN "status" = 'mutual' THEN 'RECIPROCAL'::"ConnectionState"
  WHEN "status" = 'pending' AND "initiatorId" IS NOT NULL THEN 'SIGNAL_SENT'::"ConnectionState"
  ELSE 'CLOSED'::"ConnectionState"
END,
"matchedAt" = CASE WHEN "status" = 'mutual' THEN "createdAt" ELSE NULL END,
"lastTransitionAt" = "createdAt",
"updatedAt" = "createdAt";

-- Pending rows without a known initiator cannot safely become reciprocal.
UPDATE "Match"
SET "status" = 'expired'
WHERE "status" = 'pending' AND "initiatorId" IS NULL;

-- Canonicalize legitimate legacy pairs before enforcing pair integrity.
UPDATE "Conversation"
SET "user1Id" = LEAST("user1Id", "user2Id"),
    "user2Id" = GREATEST("user1Id", "user2Id");

UPDATE "Conversation" AS c
SET "matchId" = m."id"
FROM "Match" AS m
WHERE c."matchId" IS NULL
  AND m."status" = 'mutual'
  AND LEAST(c."user1Id", c."user2Id") = m."user1Id"
  AND GREATEST(c."user1Id", c."user2Id") = m."user2Id";

ALTER TABLE "Match"
  ADD CONSTRAINT "Match_distinct_users_check" CHECK ("user1Id" <> "user2Id"),
  ADD CONSTRAINT "Match_canonical_pair_check" CHECK ("user1Id" < "user2Id"),
  ADD CONSTRAINT "Match_initiator_member_check" CHECK ("initiatorId" IS NULL OR "initiatorId" IN ("user1Id", "user2Id"));

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_distinct_users_check" CHECK ("user1Id" <> "user2Id"),
  ADD CONSTRAINT "Conversation_canonical_pair_check" CHECK ("user1Id" < "user2Id");

ALTER TABLE "Block"
  ADD CONSTRAINT "Block_distinct_users_check" CHECK ("blockerId" <> "blockedId");

ALTER TABLE "Profile"
  ADD CONSTRAINT "Profile_seeking_age_min_check" CHECK ("seekingAgeMin" IS NULL OR "seekingAgeMin" BETWEEN 18 AND 120),
  ADD CONSTRAINT "Profile_seeking_age_max_check" CHECK ("seekingAgeMax" IS NULL OR "seekingAgeMax" BETWEEN 18 AND 120),
  ADD CONSTRAINT "Profile_seeking_age_order_check" CHECK ("seekingAgeMin" IS NULL OR "seekingAgeMax" IS NULL OR "seekingAgeMin" <= "seekingAgeMax"),
  ADD CONSTRAINT "Profile_seeking_radius_check" CHECK ("seekingRadiusKm" IS NULL OR "seekingRadiusKm" BETWEEN 1 AND 500),
  ADD CONSTRAINT "Profile_onboarding_step_check" CHECK ("onboardingStep" BETWEEN 0 AND 10);

CREATE UNIQUE INDEX "Conversation_canonical_pair_key"
  ON "Conversation" (LEAST("user1Id", "user2Id"), GREATEST("user1Id", "user2Id"));

ALTER TABLE "Match" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Notification" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "EmailLog" ALTER COLUMN "updatedAt" DROP DEFAULT;

ALTER TABLE "NotificationPreference"
  ADD COLUMN "emailEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN "quietHoursStart" TEXT NOT NULL DEFAULT '22:00',
  ADD COLUMN "quietHoursEnd" TEXT NOT NULL DEFAULT '08:00',
  ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Europe/Zurich';

ALTER TABLE "NotificationPreference"
  ADD CONSTRAINT "NotificationPreference_quiet_start_check" CHECK ("quietHoursStart" ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
  ADD CONSTRAINT "NotificationPreference_quiet_end_check" CHECK ("quietHoursEnd" ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
  ADD CONSTRAINT "NotificationPreference_timezone_check" CHECK (char_length("timezone") BETWEEN 1 AND 64);

-- Safe defaults: core consistency on, experimental rituals off.
INSERT INTO "FeatureFlag" (
  "id", "key", "value", "enabled", "rolloutPercent", "environments", "config", "version", "createdAt", "updatedAt"
) VALUES
  ('ff_connection_os_feed', 'connection_os_feed', 'enabled', true, 100, ARRAY['production','development'], '{"selectionSize":5}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ff_active_connection_limit', 'active_connection_limit', 'enabled', true, 100, ARRAY['production','development'], '{"maxActive":3}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ff_reciprocal_reveal', 'reciprocal_reveal', 'enabled', true, 100, ARRAY['production','development'], '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ff_date_planning', 'date_planning', 'enabled', true, 100, ARRAY['production','development'], '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ff_embir_night', 'embir_night', 'disabled', false, 0, ARRAY['production','development'], '{"maxIntroductions":3}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ff_duo_mode', 'duo_mode', 'disabled', false, 0, ARRAY['production','development'], '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ff_circle_mode', 'circle_mode', 'disabled', false, 0, ARRAY['production','development'], '{}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
