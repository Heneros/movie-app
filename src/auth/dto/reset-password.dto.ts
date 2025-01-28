import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'A password is required' })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'A confirm password field is required' })
  @IsString()
  passwordConfirm: string;

  @IsNotEmpty()
  @IsString()
  userId: number;
}
