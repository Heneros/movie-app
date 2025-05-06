-- AlterTable
ALTER TABLE "DirectorsOnMovie" ADD CONSTRAINT "DirectorsOnMovie_pkey" PRIMARY KEY ("directorId", "movieId");

-- DropIndex
DROP INDEX "DirectorsOnMovie_directorId_movieId_key";

-- AlterTable
ALTER TABLE "UserFavoriteMovies" ADD CONSTRAINT "UserFavoriteMovies_pkey" PRIMARY KEY ("userId", "movieId");

-- DropIndex
DROP INDEX "UserFavoriteMovies_userId_movieId_key";
