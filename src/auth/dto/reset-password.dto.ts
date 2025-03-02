import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordDto {
  @Field(() => String, { nullable: false })
  @IsNotEmpty({ message: 'A password is required' })
  @IsString()
  @MinLength(6, { message: 'password must be at least 8 characters long' })
  @ApiProperty()
  password: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty({ message: 'A confirm password field is required' })
  @IsString()
  @ApiProperty()
  passwordConfirm: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
}
