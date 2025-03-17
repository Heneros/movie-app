import { ICommand } from '@nestjs/cqrs';

export class RemoveMovieFavCommand implements ICommand {
  constructor(
    public readonly movieId: number,
    public readonly userId: number,
  ) {}
}
