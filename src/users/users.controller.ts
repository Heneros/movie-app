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
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { GetAllUsersService } from './services/getAllUsers.service';
import { Response } from 'express';
import { CheckUserExistPipe } from './pipe/CheckUserExist.pipe';
import { UpdateUserService } from './services/updateMyProfile.service';
import { ProfileOwnerGuard } from './guard/ProfileOwner.guard';
import { GetIdUsersService } from './services/getIdUser.service';
import { RemoveUserAccountService } from './services/removeUser.service';
import { RemoveMyAccountService } from './services/removeMyAccount.services';
import { ChangeRoleService } from './services/changeRoleUser.service';
import { UpdateUserRole } from './dto/update-user-role.dto';
import { UserUpdatedProfileEntity } from './entities/updated-profile.entity';
import { DeactivateUserService } from './services/deactivateUser.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly getAllUsersService: GetAllUsersService,
    private readonly updateUserService: UpdateUserService,
    private readonly getIdUsersService: GetIdUsersService,
    private readonly removeUserAccountService: RemoveUserAccountService,
    private readonly removeMyAccountService: RemoveMyAccountService,
    private readonly changeRoleService: ChangeRoleService,
    private readonly deactivateUserService: DeactivateUserService,
  ) {}

  @Get()
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
  async findAll(@Query('page') pageString: number) {
    // console.log('123');
    const page = pageString ? Number(pageString) : 1;
    const skip = (page - 1) * PAGINATION_LIMIT;

    const users = await this.getAllUsersService.findAll(skip);
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
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
    return new UserEntity(await this.getIdUsersService.findOne(id));
  }

  @Put(':id')
  @UseGuards(AuthGuard, ProfileOwnerGuard)
  @ApiOperation({ summary: 'Update my profile. Only for authorized user' })
  @ApiBearerAuth('access-token')
  // @UsePipes(CheckUserExistPipe)
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', CheckUserExistPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(
      await this.updateUserService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  @Roles('Admin')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user profile. Only for admin' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.removeUserAccountService.remove(id));
  }

  @Put(':id/role')
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
      await this.changeRoleService.changeRole(id, updateUserRole),
    );
  }

  @Delete(':id/myaccount')
  @UseGuards(AuthGuard, ProfileOwnerGuard)
  @ApiOperation({ summary: 'Delete my account. Only for User' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserEntity })
  async removeMyAccount(@Param('id', ParseIntPipe) id: number) {
    return await this.removeMyAccountService.remove(id);
  }

  @Put(':id/deactivate')
  @Roles('Admin')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change role for users. Only for admin user' })
  @ApiBearerAuth('access-token')
  // @UsePipes(CheckUserExistPipe)
  @ApiCreatedResponse({ type: UserEntity })
  async deactivate(@Param('id', CheckUserExistPipe) id: number) {
    return new UserEntity(await this.deactivateUserService.deactivate(id));
  }
}
