-- Brand-owned addresses without configured mailboxes are internal legacy
-- accounts, not acquired members. Preserve the rows for audit while removing
-- them from public discovery, matching, reminders, and every growth cohort.
UPDATE "Profile" AS profile
SET
  "profileSource" = 'internal_legacy',
  "publicVisibility" = FALSE,
  "visibilityStatus" = 'HIDDEN',
  "updatedAt" = CURRENT_TIMESTAMP
FROM "User" AS account
WHERE profile."userId" = account.id
  AND profile."profileSource" = 'user_registration'
  AND LOWER(TRIM(account.email)) LIKE '%@embir.xyz'
  AND account."emailVerified" = FALSE;
