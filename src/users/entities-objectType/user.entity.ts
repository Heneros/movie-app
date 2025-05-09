import { MovieEntity } from '@/movie/entities-objectType/movie.entity';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

@ObjectType({ description: 'User' })
export class UserEntity implements User {
    @ApiProperty()
    @Field(() => ID, { nullable: false })
    id: number;

    @ApiProperty()
    @Field(() => Date, { nullable: false })
    createdAt: Date;

    @ApiProperty()
    @Field(() => Date, { nullable: false })
    updatedAt: Date;

    @ApiProperty({ description: 'Name of user' })
    @Field(() => String, { nullable: true })
    name: string;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    email: string;

    @ApiProperty()
    @Field((type) => [String], { nullable: false })
    refreshToken: string[];

    @ApiProperty()
    @Field(() => Boolean, { nullable: false })
    isEmailVerified: boolean;

    @ApiProperty()
    @Field(() => Boolean, { nullable: false })
    blocked: boolean;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    avatar: string;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    preview: string;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    googleId: string;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    githubId: string;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    discordId: string;

    @Exclude()
    @Field((type) => [String], { nullable: true })
    roles: string[];

    @ApiProperty()
    @Field(() => Int, { nullable: false })
    avatarId: number;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    provider: string;

    @Exclude()
    password: string;

    @Field(() => [MovieEntity], { nullable: true })
    movies?: MovieEntity[];

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
