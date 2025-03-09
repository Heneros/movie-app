import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Movie {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
