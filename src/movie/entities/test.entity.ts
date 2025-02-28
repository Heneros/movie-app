import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Movie' })
export class TestEntity {
  @ApiProperty()
  @Field((type) => Int)
  id: number;

  @ApiProperty()
  @Field({ nullable: true })
  avgRating: number;
}
