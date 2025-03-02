import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class BaseAuthInput {
  @Field(() => String, { nullable: false, description: 'Email of user ' })
  @IsString()
  @IsAlpha()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
