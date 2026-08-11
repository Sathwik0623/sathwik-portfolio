-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "linkedin" TEXT,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ContactLead" ("createdAt", "email", "id", "linkedin", "message", "name") SELECT "createdAt", "email", "id", "linkedin", "message", "name" FROM "ContactLead";
DROP TABLE "ContactLead";
ALTER TABLE "new_ContactLead" RENAME TO "ContactLead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
