import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Name of user' })
    @ApiProperty({ description: 'Name of User', example: 'qwerty' })
    public name: string;

    @IsEmail()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Email of user' })
    @ApiProperty({
        description: 'email@test.com',
        example: 'qwerty@gmhail.com',
    })
    public email: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Password' })
    @MinLength(6)
    @ApiProperty()
    public password: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Confirm password' })
    @MinLength(6)
    @ApiProperty()
    public passwordConfirm: string;
}
