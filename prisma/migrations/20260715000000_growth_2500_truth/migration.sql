-- Never expose legacy showcase profiles as real members.
-- Records are preserved for audit/rollback, but removed from all public discovery.
UPDATE "Profile"
SET
  "publicVisibility" = FALSE,
  "visibilityStatus" = 'HIDDEN',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "profileSource" = 'demo_vitrine';

-- Account deletion must not leave an analytics identifier pointing at a missing user.
UPDATE "AnalyticsEvent" event
SET "userId" = NULL
WHERE event."userId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "User" account WHERE account.id = event."userId"
  );

CREATE INDEX "User_deletedAt_bannedAt_createdAt_idx"
ON "User"("deletedAt", "bannedAt", "createdAt");

CREATE INDEX "Profile_profileSource_onboardingCompletedAt_idx"
ON "Profile"("profileSource", "onboardingCompletedAt");

CREATE INDEX "Profile_city_idx" ON "Profile"("city");

CREATE INDEX "AnalyticsEvent_source_campaign_occurredAt_idx"
ON "AnalyticsEvent"("source", "campaign", "occurredAt");
