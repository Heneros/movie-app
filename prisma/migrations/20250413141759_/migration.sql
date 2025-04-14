/*
  Warnings:

  - You are about to drop the column `discordIdId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_discordIdId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordIdId",
ADD COLUMN     "discordId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
