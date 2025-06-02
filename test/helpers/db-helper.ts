import { PrismaService } from '@/prisma/prisma.service';

export async function clearDatabase(prisma: PrismaService) {
    await prisma.verifyResetToken.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.avatar.deleteMany();

    await prisma.userFavoriteMovies.deleteMany();

    await prisma.reviews.deleteMany();
    await prisma.actorsOnMovies.deleteMany();
    await prisma.directorsOnMovie.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();
}
