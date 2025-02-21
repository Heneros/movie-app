/*
  Warnings:

  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - Made the column `avgRating` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "rating",
ALTER COLUMN "avgRating" SET NOT NULL,
ALTER COLUMN "avgRating" SET DEFAULT 0;
