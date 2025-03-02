import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseAuthInput } from './baseAuth.input';

@InputType()
export class AuthBasicInput extends BaseAuthInput {
  @Field(() => String, { nullable: false, description: 'Name of user ' })
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: false, description: 'Password of user ' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field(() => String, {
    nullable: false,
    description: 'Confirm password of user ',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  passwordConfirm: string;
}
