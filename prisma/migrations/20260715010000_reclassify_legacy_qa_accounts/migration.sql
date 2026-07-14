-- Keep historical automated registrations for auditability while excluding them
-- from every human-growth cohort. Reserved/test domains cannot represent a
-- deliverable voluntary user address.
UPDATE "Profile" AS profile
SET "profileSource" = 'qa_legacy'
FROM "User" AS account
WHERE profile."userId" = account.id
  AND profile."profileSource" = 'user_registration'
  AND (
    LOWER(TRIM(account.email)) LIKE '%embir-qa%'
    OR LOWER(TRIM(account.email)) LIKE '%@test.%'
    OR LOWER(TRIM(account.email)) LIKE '%.test'
    OR LOWER(TRIM(account.email)) LIKE '%.local'
    OR LOWER(TRIM(account.email)) ~ '@example\.(com|org|net|invalid)$'
  );
