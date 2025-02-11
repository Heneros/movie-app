import { PrismaService } from '../../src/src/prisma/prisma.service';

export async function clearDatabase(prisma: PrismaService) {
  await prisma.verifyResetToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.movie.deleteMany({});
}
