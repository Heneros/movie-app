import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'MovieReview' })
export class MovieReviewEntity {
  @ApiProperty()
  @Field(() => String, { nullable: false })
  review: string;

  @ApiProperty()
  @Field(() => Boolean, { nullable: false })
  positive: boolean;

  @ApiProperty()
  @Field(() => String, { nullable: false })
  createdAt: Date;
}
