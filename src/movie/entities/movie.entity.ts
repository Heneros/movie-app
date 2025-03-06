import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Movie' })
export class MovieEntity implements Movie {
  @ApiProperty()
  @Field((type) => Int)
  id: number;

  @ApiProperty()
  @Field(() => String, { nullable: false })
  title: string;

  @ApiProperty()
  @Field({ nullable: false })
  description: string;

  @ApiProperty()
  @Field({ nullable: false })
  category: string;

  // @ApiProperty()
  // @Field((type) => Int, { nullable: false })
  // rating: number;

  @ApiProperty()
  @Field({ nullable: false })
  preview: string;

  @ApiProperty()
  @Field({ nullable: true })
  published: boolean;

  @ApiProperty()
  @Field({ nullable: true })
  createdAt: Date;

  @ApiProperty()
  @Field({ nullable: true })
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  @Field({ nullable: true })
  authorId: number;


  
  @ApiProperty({ required: false, type: UserEntity })
  @Field((type) => [UserEntity])
  // @Field((type) => [String])
  author: UserEntity;

  @ApiProperty()
  @Field((type) => [String])
  actorsList: string[];

  @ApiProperty()
  @Field({ nullable: true })
  movieId?: number;

  @ApiProperty()
  @Field({ nullable: true })
  userId: number;

  @ApiProperty()
  @Field({ nullable: true })
  avgRating: number;

  @ApiProperty()
  @Field((type) => Int, { nullable: true })
  value: number;

  constructor({ author, ...data }: Partial<MovieEntity>) {
    Object.assign(this, data);

    if (author) {
      this.author = new UserEntity(author);
    }
  }
}
