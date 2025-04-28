import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordDto {
    @IsNotEmpty({ message: 'A password is required' })
    @IsString()
    @Field(() => String, {
        nullable: false,
        description: ' password must be at least 8 characters long',
    })
    @MinLength(6, { message: 'password must be at least 8 characters long' })
    @ApiProperty({})
    password: string;

    @IsNotEmpty({ message: 'A confirm password field is required' })
    @IsString()
    @Field(() => String, {
        nullable: false,
        description: 'A confirm password field is required',
    })
    @ApiProperty()
    passwordConfirm: string;
}
