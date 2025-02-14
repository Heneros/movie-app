/*
  Warnings:

  - You are about to drop the `UserFavoriteMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFavoriteMovies" DROP CONSTRAINT "UserFavoriteMovies_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteMovies" DROP CONSTRAINT "UserFavoriteMovies_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteMovies" INTEGER[];

-- DropTable
DROP TABLE "UserFavoriteMovies";
