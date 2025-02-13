/*
  Warnings:

  - A unique constraint covering the columns `[movieId]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_movieId_key" ON "Reviews"("movieId");
