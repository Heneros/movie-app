import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Name of user' })
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  refreshToken: string[];

  @ApiProperty()
  isEmailVerified: boolean;

  @Exclude()
  roles: string[];

  @Exclude()
  password: string;
}
