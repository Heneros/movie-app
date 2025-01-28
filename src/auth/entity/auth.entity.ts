import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
 
  

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
