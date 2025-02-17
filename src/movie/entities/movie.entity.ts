import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MovieEntity implements Movie {
  @ApiProperty()
  @Field((type) => Int)
  id: number;

  @ApiProperty()
  
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  authorId: number;

  @ApiProperty({ required: false, type: UserEntity })
  author?: UserEntity;

  @ApiProperty()
  actorsList: string[];

  @ApiProperty()
  movieId?: number;

  @ApiProperty()
  userId: number;

  constructor({ author, ...data }: Partial<MovieEntity>) {
    Object.assign(this, data);

    if (author) {
      this.author = new UserEntity(author);
    }
  }
}
