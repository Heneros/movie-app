import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'exmple1@email.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({ example: '**********' })
    password: string;
}
