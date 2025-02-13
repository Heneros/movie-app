/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "actorsList" TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "positive" BOOLEAN NOT NULL,
    "review" VARCHAR(2550)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Actors" (
    "id" SERIAL NOT NULL,
    "preview" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_auId_key" ON "Reviews"("auId");

-- CreateIndex
CREATE UNIQUE INDEX "Actors_name_key" ON "Actors"("name");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_auId_fkey" FOREIGN KEY ("auId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_id_fkey" FOREIGN KEY ("id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
