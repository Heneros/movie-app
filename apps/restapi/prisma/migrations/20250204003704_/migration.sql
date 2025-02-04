/*
  Warnings:

  - Made the column `expiresAt` on table `VerifyResetToken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VerifyResetToken" ALTER COLUMN "expiresAt" SET NOT NULL;
