/*
  Warnings:

  - Added the required column `actorId` to the `Gallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "actorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
