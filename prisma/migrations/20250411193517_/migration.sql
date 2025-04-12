-- DropForeignKey
ALTER TABLE "Actors" DROP CONSTRAINT "Actors_previewId_fkey";

-- AlterTable
ALTER TABLE "Actors" ALTER COLUMN "previewId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Actors" ADD CONSTRAINT "Actors_previewId_fkey" FOREIGN KEY ("previewId") REFERENCES "Avatar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
