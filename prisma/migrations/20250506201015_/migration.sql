/*
  Warnings:

  - The primary key for the `DirectorsOnMovie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[directorId,movieId]` on the table `DirectorsOnMovie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DirectorsOnMovie" DROP CONSTRAINT "DirectorsOnMovie_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "DirectorsOnMovie_directorId_movieId_key" ON "DirectorsOnMovie"("directorId", "movieId");
