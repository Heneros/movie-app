import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

@InputType()
export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Email' })
    @ApiProperty({ example: 'exmple1@email.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Field(() => String, {
        nullable: false,
        description: 'Password minimum 6 symbols',
    })
    @ApiProperty({ example: '**********' })
    password: string;
}
