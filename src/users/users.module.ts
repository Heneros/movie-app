import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { GetAllUsersService } from './services/getAllUsers.service';
import { UpdateUserService } from './services/updateMyProfile.service';
import { GetIdUsersService } from './services/getIdUser.service';
import { RemoveUserAccountService } from './services/removeUser.service';
import { RemoveMyAccountService } from './services/removeMyAccount.services';
import { ChangeRoleService } from './services/changeRoleUser.service';
import { DeactivateUserService } from './services/deactivateUser.service';
import { UsersRepository } from './repositories/users.repository';
import {
    FindAllUsersHandler,
    GetIdUserHandler,
    UpdateUserHandler,
} from './handlers';
import { DeleteUserHandler } from './handlers/DeleteUser.handler';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        GetAllUsersService,
        UpdateUserService,
        GetIdUsersService,
        RemoveUserAccountService,
        RemoveMyAccountService,
        ChangeRoleService,
        DeactivateUserService,

        UsersRepository,
        FindAllUsersHandler,
        GetIdUserHandler,
        UpdateUserHandler,
        DeleteUserHandler,
    ],
    imports: [PrismaModule, MailModule],
    exports: [UsersService],
})
export class UsersModule {}
