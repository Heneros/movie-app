import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class EmailDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Email user' })
    @ApiProperty()
    email: string;
}
