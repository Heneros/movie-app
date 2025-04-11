/*
  Warnings:

  - You are about to drop the column `preview` on the `Actors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[previewId]` on the table `Actors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `previewId` to the `Actors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Actors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actors" DROP COLUMN "preview",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "previewId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Actors_previewId_key" ON "Actors"("previewId");

-- AddForeignKey
ALTER TABLE "Actors" ADD CONSTRAINT "Actors_previewId_fkey" FOREIGN KEY ("previewId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
