import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType({ description: 'Auth' })
export class AuthEntity {
    @Field()
    message: string;

    @ApiProperty()
    @Field(() => Int, { nullable: true })
    id?: number;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    accessToken: string;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    refreshToken: string;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    name: string;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    email?: string;

    constructor(partial: Partial<AuthEntity>) {
        Object.assign(this, partial);
    }
}
