import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class ResendEmailDto {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
