/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[previewId]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[actorsId]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userId_key" ON "Avatar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_previewId_key" ON "Avatar"("previewId");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_actorsId_key" ON "Avatar"("actorsId");
