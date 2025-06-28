import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { UsersRepository } from './repositories/users.repository';
import {
    BanUserAccountHandler,
    ChangeRoleHandler,
    DeleteMyAccountHandler,
    DeleteUserHandler,
    FindAllUsersHandler,
    GetAllBlockedUsersHandler,
    GetIdUserHandler,
    UpdateUserHandler,
} from './handlers';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { UsersResolver } from './users.resolver';
import { PubSub } from 'graphql-subscriptions';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersRepository,

        FindAllUsersHandler,
        GetIdUserHandler,
        UpdateUserHandler,
        DeleteUserHandler,
        DeleteMyAccountHandler,
        ChangeRoleHandler,
        BanUserAccountHandler,
        GetAllBlockedUsersHandler,

        UsersResolver,

        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        },
    ],
    imports: [
        PrismaModule,
        MailModule,
        CloudinaryModule,
        CacheModule.register(),
    ],
    exports: [UsersService],
})
export class UsersModule {}
