import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {


  @ApiProperty({})
  id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'testuser', example: 'Name user' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'email@test.com', example: 'qwerty@gmhail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  passwordConfirm: string;
}
