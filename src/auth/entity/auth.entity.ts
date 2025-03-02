import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class AuthEntity {
  @ApiProperty()
  @Field((type) => Int)
  id?: number;

  @ApiProperty()
  @Field((type) => String)
  accessToken: string;

  @ApiProperty()
  @Field((type) => String)
  name: string;

  @ApiProperty()
  @Field((type) => String)
  email: string;

  @ApiProperty()
  @Field((type) => String)
  emailVerificationToken?: string;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
