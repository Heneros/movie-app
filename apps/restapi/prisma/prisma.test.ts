import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function resetDatabase() {
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verifyResetToken.deleteMany();
}
