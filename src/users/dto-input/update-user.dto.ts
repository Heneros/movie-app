import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateUserDto } from '@/auth/dto-input/Create-user.dto';
import { Field, ID, InputType } from '@nestjs/graphql';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export enum UserRole {
    Admin = 'Admin',
    Editor = 'Editor',
    User = 'User',
}

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    // @ApiProperty()
    // @Field(() => ID, { nullable: true })
    // id: number;

    // @ApiProperty()
    // @Field(() => Date, { nullable: true })
    // createdAt: Date;

    // @ApiProperty()
    // updatedAt: Date;

    // @ApiProperty({
    //     example: ['Admin'],
    //     description: 'User role',
    //     isArray: true,
    // })
    // @IsArray()
    // @ArrayMinSize(1)
    // @IsEnum(UserRole, { each: true })
    // @IsNotEmpty()
    // roles: string[];

    @ApiProperty()
    @Field(() => String, { nullable: true })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    email: string;

    // @ApiProperty()
    // // @IsNotEmpty()
    // // @IsString()
    // @Exclude()
    // @Field(() => [String], { nullable: true })
    // refreshToken: string[];

    // @Exclude()
    @IsString()
    // @IsOptional()
    @MinLength(6)
    password: string;

    // @Exclude()
    // isEmailVerified: boolean;
}
