-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarId_fkey";

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "previewId" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarId" DROP NOT NULL,
ALTER COLUMN "avatarId" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
