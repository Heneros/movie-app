import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
    Admin = 'Admin',
    Editor = 'Editor',
    User = 'User',
}

registerEnumType(UserRole, {
    name: 'roles',
    description: 'Roles available for users',
});

@InputType()
export class UpdateUserRole {
    @ApiProperty({
        example: ['Admin'],
        description: 'User role',
        isArray: true,
    })
    //   @IsString()
    @Field(() => [UserRole], { nullable: false })
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(UserRole, { each: true })
    @IsNotEmpty()
    roles: string[];
}
