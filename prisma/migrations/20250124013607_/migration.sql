-- CreateTable
CREATE TABLE "VerifyResetToken" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyResetToken_userId_key" ON "VerifyResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyResetToken_token_key" ON "VerifyResetToken"("token");

-- AddForeignKey
ALTER TABLE "VerifyResetToken" ADD CONSTRAINT "VerifyResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
