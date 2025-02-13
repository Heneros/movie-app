/*
  Warnings:

  - You are about to drop the column `positive` on the `Reviews` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_id_fkey";

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "positive",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
