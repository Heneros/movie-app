import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

@ObjectType({ description: 'Movie' })
export class UserUpdatedProfileEntity implements User {
    @ApiProperty()
    @Field(() => Int)
    id: number;

    @ApiProperty()
    @Field(() => Date)
    createdAt: Date;

    @ApiProperty()
    @Field(() => Date)
    updatedAt: Date;

    @ApiProperty({ description: 'Name of user' })
    @Field(() => String)
    name: string;

    @ApiProperty()
    @Field(() => String)
    email: string;

    @ApiProperty()
    @Field(() => [String])
    refreshToken: string[];

    @ApiProperty()
    @Field(() => Boolean)
    isEmailVerified: boolean;

    @ApiProperty()
    @Field(() => [String])
    roles: string[];

    @Exclude()
    // @Field(() => String)
    password: string;

    constructor(partial: Partial<UserUpdatedProfileEntity>) {
        Object.assign(this, partial);
    }
}
