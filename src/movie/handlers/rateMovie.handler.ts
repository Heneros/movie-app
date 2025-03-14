import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RateMovieCommand } from '../commands/rateMovie.command';

@CommandHandler(RateMovieCommand)
export class RateMovieHandler implements ICommandHandler<RateMovieCommand> {
    constructor(private prisma: PrismaService) {}

    async execute(command: RateMovieCommand) {
        const { movieId, userId, value } = command;
        const existingRating = await this.prisma.rating.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });

        if (existingRating) {
            await this.prisma.rating.update({
                where: { id: existingRating.id },
                data: { value },
            });
        } else {
            await this.prisma.rating.create({
                data: {
                    value,
                    user: { connect: { id: userId } },
                    movie: { connect: { id: movieId } },
                },
            });
        }

        const ratings = await this.prisma.rating.findMany({
            where: { movieId },
            select: { value: true },
        });

        const total = ratings.reduce((sum, r) => sum + r.value, 0);
        const avg = ratings.length > 0 ? total / ratings.length : 0;

        return this.prisma.movie.update({
            where: { id: movieId },
            data: { avgRating: isNaN(avg) ? 0 : avg },
        });
    }
}
