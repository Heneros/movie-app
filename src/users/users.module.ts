import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { UsersRepository } from './repositories/users.repository';
import {
    BanUserAccount,
    ChangeRoleHandler,
    DeleteMyAccountHandler,
    DeleteUserHandler,
    FindAllUsersHandler,
    GetAllBlockedUsersHandler,
    GetIdUserHandler,
    UpdateUserHandler,
} from './handlers';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        // GetAllUsersService,
        // UpdateUserService,
        // GetIdUsersService,
        // RemoveUserAccountService,
        // RemoveMyAccountService,
        // ChangeRoleService,
        // DeactivateUserService,

        UsersRepository,
        FindAllUsersHandler,
        GetIdUserHandler,
        UpdateUserHandler,
        DeleteUserHandler,
        ChangeRoleHandler,
        DeleteMyAccountHandler,
        BanUserAccount,
        GetAllBlockedUsersHandler,
    ],
    imports: [PrismaModule, MailModule, CloudinaryModule],
    exports: [UsersService],
})
export class UsersModule {}
