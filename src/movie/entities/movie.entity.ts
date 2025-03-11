import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Movie' })
export class MovieEntity implements Movie {
    @ApiProperty()
    @Field(() => Int)
    id: number;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    title: string;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    description: string;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    category: string;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    preview: string;

    @ApiProperty()
    @Field(() => Boolean, { nullable: true })
    published: boolean;

    @ApiProperty()
    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @ApiProperty()
    @Field(() => Date, { nullable: true })
    updatedAt: Date;

    @ApiProperty({ required: false, nullable: true })
    @Field(() => Int, { nullable: true })
    authorId: number;

    @ApiProperty({ required: false, type: UserEntity })
    @Field(() => [UserEntity])
    author: UserEntity;

    @ApiProperty()
    @Field(() => [String])
    actorsList: string[];

    @ApiProperty()
    @Field(() => Int, { nullable: true })
    movieId?: number;

    @ApiProperty()
    @Field(() => Int, { nullable: true })
    userId: number;

    @ApiProperty()
    @Field(() => Float, { nullable: true }) // Убедитесь, что avgRating это числовой тип
    avgRating: number;

    @Field(() => Int, { nullable: true })
    value: number;

    constructor({ author, ...data }: Partial<MovieEntity>) {
        Object.assign(this, data);
        if (author) {
            this.author = new UserEntity(author);
        }
    }
}
