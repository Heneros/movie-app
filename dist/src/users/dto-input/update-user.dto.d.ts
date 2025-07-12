import { CreateUserDto } from '@/auth/dto-input/Create-user.dto';
export declare enum UserRole {
    Admin = "Admin",
    Editor = "Editor",
    User = "User"
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    name: string;
    email: string;
    password: string;
}
export {};
