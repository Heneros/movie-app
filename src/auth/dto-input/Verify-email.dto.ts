import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyEmailDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    emailToken: string;
}
