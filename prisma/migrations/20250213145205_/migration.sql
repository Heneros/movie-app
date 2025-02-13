/*
  Warnings:

  - A unique constraint covering the columns `[movieId]` on the table `Actors` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Actors" ADD COLUMN     "movieId" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Actors_movieId_key" ON "Actors"("movieId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_actorsList_fkey" FOREIGN KEY ("actorsList") REFERENCES "Actors"("movieId") ON DELETE SET NULL ON UPDATE CASCADE;
