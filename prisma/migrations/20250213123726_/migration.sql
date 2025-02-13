/*
  Warnings:

  - You are about to alter the column `review` on the `Reviews` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2550)` to `VarChar(2550)`.

*/
-- AlterTable
ALTER TABLE "Actors" ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "age" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "review" SET NOT NULL,
ALTER COLUMN "review" SET DATA TYPE VARCHAR(2550);
