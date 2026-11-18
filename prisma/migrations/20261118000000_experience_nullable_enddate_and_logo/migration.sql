-- AlterTable: make endDate nullable on Experience (supports ongoing/current roles)
ALTER TABLE "Experience" ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable: add logoUrl column for persistent company logo URL
ALTER TABLE "Experience" ADD COLUMN "logoUrl" TEXT;
