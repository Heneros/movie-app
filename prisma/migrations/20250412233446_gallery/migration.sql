/*
  Warnings:

  - A unique constraint covering the columns `[galleryId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "galleryId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_galleryId_key" ON "Movie"("galleryId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
