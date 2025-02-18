import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

@ObjectType()
export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Field({ nullable: false })
  id: number;

  @ApiProperty()
  @Field({ nullable: false })
  createdAt: Date;

  @ApiProperty()
  @Field({ nullable: false })
  updatedAt: Date;

  @ApiProperty({ description: 'Name of user' })
  @Field({ nullable: true })
  name: string;

  @ApiProperty()
  @Field({ nullable: true })
  email: string;

  @ApiProperty()
  @Field((type) => [String], { nullable: false })
  refreshToken: string[];

  @ApiProperty()
  @Field({ nullable: false })
  isEmailVerified: boolean;

  @Exclude()
  roles: string[];

  @Exclude()
  password: string;
}
