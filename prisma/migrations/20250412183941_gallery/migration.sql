-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_actorId_fkey";

-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_movieId_fkey";

-- AlterTable
ALTER TABLE "Gallery" ALTER COLUMN "movieId" DROP NOT NULL,
ALTER COLUMN "actorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
