ALTER TABLE "Prospect"
  ADD COLUMN "organizationType" TEXT,
  ADD COLUMN "publicContact" TEXT,
  ADD COLUMN "contactChannel" TEXT,
  ADD COLUMN "contactSourceUrl" TEXT,
  ADD COLUMN "permissionStatus" TEXT NOT NULL DEFAULT 'not_requested',
  ADD COLUMN "permissionRequestedAt" TIMESTAMP(3),
  ADD COLUMN "permissionGrantedAt" TIMESTAMP(3),
  ADD COLUMN "optedOutAt" TIMESTAMP(3),
  ADD COLUMN "nextFollowUpAt" TIMESTAMP(3),
  ADD COLUMN "campaign" TEXT,
  ADD COLUMN "utmSource" TEXT;

CREATE INDEX "Prospect_permissionStatus_nextFollowUpAt_idx"
ON "Prospect"("permissionStatus", "nextFollowUpAt");

CREATE INDEX "Prospect_city_status_idx"
ON "Prospect"("city", "status");
