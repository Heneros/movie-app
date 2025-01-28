import { ApiProperty } from '@nestjs/swagger';

export class AuthRegister {
  emailVerificationToken: {
    userId: number;
    token: string;
    createdAt: Date;
  };

  email: string;

  constructor(partial: Partial<AuthRegister>) {
    Object.assign(this, partial);
  }
}
