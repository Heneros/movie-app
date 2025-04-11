-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_previewId_fkey";

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "previewId" DROP NOT NULL,
ALTER COLUMN "previewId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_previewId_fkey" FOREIGN KEY ("previewId") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
