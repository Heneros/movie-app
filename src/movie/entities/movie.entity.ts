import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { UpdateUserDto } from '@/users/dto-input/update-user.dto';

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

    @ApiProperty({ required: false, nullable: true })
    @Field(() => Int, { nullable: true })
    previewId: number;

    @ApiProperty({ required: false, type: UserEntity })
    @Field(() => [String], { nullable: false })
    author: UpdateUserDto;

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
    @Field(() => Int, { nullable: true })
    galleryId: number;

    @ApiProperty()
    @Field(() => Float, { nullable: true })
    avgRating: number;

    @Field(() => Int, { nullable: true })
    year: number;

    constructor({ author, ...data }: Partial<MovieEntity>) {
        Object.assign(this, data);
        if (author) {
            this.author = new UpdateUserDto(author);
        }
    }
}
