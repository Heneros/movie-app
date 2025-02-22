-- DropForeignKey
ALTER TABLE "VerifyResetToken" DROP CONSTRAINT "VerifyResetToken_userId_fkey";

-- AddForeignKey
ALTER TABLE "VerifyResetToken" ADD CONSTRAINT "VerifyResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
