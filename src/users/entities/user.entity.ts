import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

@ObjectType()
export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

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

    @Exclude()
    @Field((type) => [String], { nullable: true })
    roles: string[];

    @Exclude()
    password: string;
}
