import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

// @ArgsType()
@InputType()
export class LoginInput {
  @Field(() => String, { nullable: false })
  @IsString()
  email: string;

  @Field(() => String, { nullable: false })
  @IsString()
  password: string;
}
