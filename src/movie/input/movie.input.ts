import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class MovieBasicInput {
  @Field(() => Int, { nullable: false, description: 'Id movie' })
  @IsInt()
  movieId: number;

  @Field(() => Int, { nullable: false, description: 'Id user' })
  @IsInt()
  userId: number;
}
