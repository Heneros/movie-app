import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export enum UserRole {
    Admin = 'Admin',
    Editor = 'Editor',
    User = 'User',
}

export class UpdateUserRole {
    @ApiProperty({
        example: ['Admin'],
        description: 'User role',
        isArray: true,
    })
    //   @IsString()
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(UserRole, { each: true })
    @IsNotEmpty()
    roles: string[];
}
