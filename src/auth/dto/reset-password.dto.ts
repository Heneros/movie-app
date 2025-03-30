import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty({ message: 'A password is required' })
    @IsString()
    @MinLength(6, { message: 'password must be at least 8 characters long' })
    @ApiProperty({})
    password: string;

    @IsNotEmpty({ message: 'A confirm password field is required' })
    @IsString()
    @ApiProperty()
    passwordConfirm: string;
}
