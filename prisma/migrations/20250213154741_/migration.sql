/*
  Warnings:

  - Added the required column `positive` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "positive" BOOLEAN NOT NULL;
