import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Query,
    Res,
    UsePipes,
    Put,
    Req,
    DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiBearerAuth,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@/guards/auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { GetAllUsersService } from './services/getAllUsers.service';
import { Request, Response } from 'express';
import { CheckUserExistPipe } from './pipe/CheckUserExist.pipe';
import { UpdateUserService } from './services/updateMyProfile.service';
import { ProfileOwnerGuard } from '../guards/ProfileOwner.guard';
import { GetIdUsersService } from './services/getIdUser.service';
import { RemoveUserAccountService } from './services/removeUser.service';
import { RemoveMyAccountService } from './services/removeMyAccount.services';
import { ChangeRoleService } from './services/changeRoleUser.service';
import { UpdateUserRole } from './dto/update-user-role.dto';
import { UserUpdatedProfileEntity } from './entities/updated-profile.entity';
import { DeactivateUserService } from './services/deactivateUser.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindAllUsersQuery, GetIdUserQuery } from './queries';
import { plainToInstance } from 'class-transformer';
import { USERS_CONTROLLER, USERS_ROUTES } from '@/sites/site.constants';
import {
    ChangeRoleCommand,
    DeactivateUserAccountCommand,
    DeleteMyAccountCommand,
    DeleteUserCommand,
    UpdateUserCommand,
} from './commands';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller(USERS_CONTROLLER)
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly removeMyAccountService: RemoveMyAccountService,
        private readonly changeRoleService: ChangeRoleService,
        private readonly deactivateUserService: DeactivateUserService,

        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Get(USERS_ROUTES.GET_ALL)
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiBearerAuth('access-token')
    @ApiCookieAuth('cookie-auth')
    @ApiOkResponse({ type: UserEntity, isArray: true })
    @ApiOperation({ summary: 'For admin. Get All User' })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        type: Number,
    })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        const newUsers = await this.queryBus.execute(
            new FindAllUsersQuery(page),
        );
        return plainToInstance(UserEntity, newUsers);
    }

    @Get(USERS_ROUTES.GET_ID_USER)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'For all register. Get id user' })
    @ApiBearerAuth('access-token')
    @ApiCookieAuth('cookie-auth')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Id for user',
        type: Number,
    })
    @UsePipes(CheckUserExistPipe)
    @ApiOkResponse({ type: UserEntity })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.queryBus.execute(new GetIdUserQuery(id));
        // return user;
        // const newUsers = awa
        return plainToInstance(UserEntity, user);
    }

    @Put(USERS_ROUTES.UPDATE_USER)
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiOperation({ summary: 'Update my profile. Only for authorized user' })
    @ApiBearerAuth('access-token')
    @ApiCreatedResponse({ type: UserEntity })
    async update(
        @Param('id', CheckUserExistPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const result = await this.commandBus.execute(
            new UpdateUserCommand(id, updateUserDto),
        );

        return plainToInstance(UserEntity, result);
        // return new UserEntity(result);
    }

    @Delete(USERS_ROUTES.DELETE_USER)
    @Roles('Admin')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete user profile. Only for admin' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: UserEntity })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const result = await this.commandBus.execute(new DeleteUserCommand(id));
        return result;
        // return new UserEntity(await this.removeUserAccountService.remove(id));
    }

    @Put(USERS_ROUTES.CHANGE_ROLE)
    @Roles('Admin')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Change role for users. Only for admin user' })
    @ApiBearerAuth('access-token')
    // @UsePipes(CheckUserExistPipe)
    @ApiCreatedResponse({ type: UserUpdatedProfileEntity })
    async changeRole(
        @Param('id', CheckUserExistPipe) id: number,
        @Body() updateUserRole: UpdateUserRole,
    ) {
        // console.log(updateUserRole);
        return new UserUpdatedProfileEntity(
            await this.commandBus.execute(
                new ChangeRoleCommand(id, updateUserRole),
            ),
        );
        // return new UserUpdatedProfileEntity(
        //     await this.changeRoleService.changeRole(req, id, updateUserRole),
        // );
    }

    @Delete(USERS_ROUTES.DELETE_MY_ACCOUNT)
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiOperation({ summary: 'Delete my account. Only for User' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: UserEntity })
    async removeMyAccount(@Param('id', ParseIntPipe) id: number) {
        return await this.commandBus.execute(new DeleteMyAccountCommand(id));
        // return await this.removeMyAccountService.remove(id);
    }

    @Put(USERS_ROUTES.DEACTIVATE_USER_ACCOUNT)
    @UseGuards(AuthGuard)
    @Roles('Admin')
    @ApiOperation({ summary: 'Change role for users. Only for admin user' })
    @ApiBearerAuth('access-token')
    // @UsePipes(CheckUserExistPipe)
    //@ApiCreatedResponse({ type: UserEntity })
    async deactivate(@Param('id', CheckUserExistPipe) id: number) {
        return await this.commandBus.execute(
            new DeactivateUserAccountCommand(id),
        );
        // return new UserEntity(await this.deactivateUserService.deactivate(id));
    }
}
