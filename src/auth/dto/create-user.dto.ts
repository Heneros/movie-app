import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'testuser', example: 'qwerty' })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'email@test.com',
        example: 'qwerty@gmhail.com',
    })
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
