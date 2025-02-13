/*
  Warnings:

  - You are about to drop the column `movieId` on the `Actors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Actors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_actorsList_fkey";

-- DropIndex
DROP INDEX "Actors_movieId_key";

-- DropIndex
DROP INDEX "Reviews_movieId_key";

-- AlterTable
ALTER TABLE "Actors" DROP COLUMN "movieId";

-- CreateTable
CREATE TABLE "ActorsOnMovies" (
    "actorId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "ActorsOnMovies_pkey" PRIMARY KEY ("actorId","movieId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActorsOnMovies_actorId_key" ON "ActorsOnMovies"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "Actors_id_key" ON "Actors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_id_key" ON "Reviews"("id");

-- AddForeignKey
ALTER TABLE "ActorsOnMovies" ADD CONSTRAINT "ActorsOnMovies_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsOnMovies" ADD CONSTRAINT "ActorsOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
