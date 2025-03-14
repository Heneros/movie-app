import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMovieCommand } from '../commands/removeMovie.command';
import { PrismaService } from '@/prisma/prisma.service';

@CommandHandler(RemoveMovieCommand)
export class RemoveMovieHandler implements ICommandHandler<RemoveMovieCommand> {
    constructor(private readonly prisma: PrismaService) {}
    async execute(command: RemoveMovieCommand) {
        const { id } = command;

        return this.prisma.movie.delete({ where: { id } });
    }
}
