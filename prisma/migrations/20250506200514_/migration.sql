/*
  Warnings:

  - The primary key for the `UserFavoriteMovies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,movieId]` on the table `UserFavoriteMovies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserFavoriteMovies" DROP CONSTRAINT "UserFavoriteMovies_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteMovies_userId_movieId_key" ON "UserFavoriteMovies"("userId", "movieId");
