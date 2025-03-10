import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyEmailDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  emailToken: string;
}
