/*
  Warnings:

  - You are about to drop the column `preview` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[previewId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `previewId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatarId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "preview",
ADD COLUMN     "previewId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ADD COLUMN     "avatarId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Avatar" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_previewId_key" ON "Movie"("previewId");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_previewId_fkey" FOREIGN KEY ("previewId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
