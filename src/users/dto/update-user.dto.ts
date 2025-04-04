import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateUserDto } from '@/auth/dto/Create-user.dto';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @Field(() => ID, { nullable: true })
    id: number;

    // @ApiProperty()
    // @Field(() => Date, { nullable: true })
    // createdAt: Date;

    // @ApiProperty()
    // updatedAt: Date;

    @ApiProperty()
    @Field(() => String, { nullable: true })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Field(() => String, { nullable: true })
    email: string;

    @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    @Field(() => [String], { nullable: true })
    refreshToken: string[];

    @Exclude()
    password: string;

    @Exclude()
    isEmailVerified: boolean;
}
