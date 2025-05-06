/*
  Warnings:

  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActorsOnMovies" DROP CONSTRAINT "ActorsOnMovies_actorId_fkey";

-- DropForeignKey
ALTER TABLE "ActorsOnMovies" DROP CONSTRAINT "ActorsOnMovies_movieId_fkey";

-- DropIndex
DROP INDEX "User_avatarId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarId";

-- AddForeignKey
ALTER TABLE "ActorsOnMovies" ADD CONSTRAINT "ActorsOnMovies_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsOnMovies" ADD CONSTRAINT "ActorsOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
