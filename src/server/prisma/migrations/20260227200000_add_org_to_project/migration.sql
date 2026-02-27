-- AlterTable: add organizationId as nullable first
ALTER TABLE "project" ADD COLUMN "organizationId" TEXT;

-- Backfill: create a personal org for each user that owns projects, then link
-- For each distinct userId in projects, insert an organization and a member row,
-- then set organizationId on the projects.
DO $$
DECLARE
  r RECORD;
  org_id TEXT;
  member_id TEXT;
BEGIN
  FOR r IN SELECT DISTINCT u.id AS user_id, u.name, u.email FROM "user" u
           INNER JOIN "project" p ON p."userId" = u.id
  LOOP
    org_id := gen_random_uuid()::text;
    member_id := gen_random_uuid()::text;

    INSERT INTO "organization" ("id", "name", "slug", "createdAt")
    VALUES (org_id, COALESCE(r.name, r.email) || '''s Org', LOWER(REPLACE(COALESCE(r.name, r.email), ' ', '-')) || '-' || SUBSTRING(org_id, 1, 8), NOW());

    INSERT INTO "member" ("id", "userId", "organizationId", "role", "createdAt")
    VALUES (member_id, r.user_id, org_id, 'owner', NOW());

    UPDATE "project" SET "organizationId" = org_id WHERE "userId" = r.user_id;
  END LOOP;
END $$;

-- Make column non-nullable now that all rows have values
ALTER TABLE "project" ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "project_organizationId_idx" ON "project"("organizationId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
