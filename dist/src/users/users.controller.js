"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const update_user_dto_1 = require("./dto-input/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./entities-objectType/user.entity");
const auth_guard_1 = require("../guards/auth.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const CheckUserExist_pipe_1 = require("./pipe/CheckUserExist.pipe");
const ProfileOwner_guard_1 = require("../guards/ProfileOwner.guard");
const update_user_role_dto_1 = require("./dto-input/update-user-role.dto");
const cqrs_1 = require("@nestjs/cqrs");
const queries_1 = require("./queries");
const class_transformer_1 = require("class-transformer");
const site_constants_1 = require("../sites/site.constants");
const commands_1 = require("./commands");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const multer_1 = require("multer");
const file_upload_dto_1 = require("./dto-input/file-upload.dto");
let UsersController = class UsersController {
    cloudinaryService;
    commandBus;
    queryBus;
    constructor(cloudinaryService, commandBus, queryBus) {
        this.cloudinaryService = cloudinaryService;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async findAll(page) {
        const newUsers = await this.queryBus.execute(new queries_1.FindAllUsersQuery(page));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, newUsers);
    }
    async allBlocked(page) {
        const users = await this.queryBus.execute(new queries_1.GetAllBlockedUsersQuery(page));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, users);
    }
    async findOne(id) {
        const user = await this.queryBus.execute(new queries_1.GetIdUserQuery(id));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, user);
    }
    async update(userId, updateUserDto) {
        const result = await this.commandBus.execute(new commands_1.UpdateUserCommand(userId, updateUserDto));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, result);
    }
    async remove(id) {
        const result = await this.commandBus.execute(new commands_1.DeleteUserCommand(id));
        return result;
    }
    async changeRole(id, updateUserRole) {
        return new user_entity_1.UserEntity(await this.commandBus.execute(new commands_1.ChangeRoleCommand(id, updateUserRole)));
    }
    async removeMyAccount(userId) {
        return await this.commandBus.execute(new commands_1.DeleteMyAccountCommand(userId));
    }
    async banUser(id) {
        return await this.commandBus.execute(new commands_1.BanUserAccountCommand(id));
    }
    async uploadImage(userId, file) {
        try {
            if (!file) {
                return 'Error during upload file';
            }
            const result = await this.cloudinaryService.uploadFileAvatarUser(+userId, file, file.originalname);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Upload error:', error);
            throw new common_1.BadGatewayException(error.message || 'Authentication failed');
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(site_constants_1.USERS_ROUTES.GET_ALL),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiCookieAuth)('cookie-auth'),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.UserEntity, isArray: true }),
    (0, swagger_1.ApiOperation)({ summary: 'For admin. Get All User' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        type: Number,
    }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(site_constants_1.USERS_ROUTES.LIST_BLOCKED_USERS),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'All users blocked',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all accounts users blocked' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "allBlocked", null);
__decorate([
    (0, common_1.Get)(site_constants_1.USERS_ROUTES.GET_ID_USER),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'For all register. Get id user' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiCookieAuth)('cookie-auth'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Id for user',
        type: Number,
    }),
    (0, common_1.UsePipes)(CheckUserExist_pipe_1.CheckUserExistPipe),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.UserEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(site_constants_1.USERS_ROUTES.UPDATE_USER),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update my profile. Only for authorized user' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiCreatedResponse)({ type: user_entity_1.UserEntity }),
    __param(0, (0, common_1.Param)('userId', CheckUserExist_pipe_1.CheckUserExistPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(site_constants_1.USERS_ROUTES.DELETE_USER),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user profile. Only for admin' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.UserEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(site_constants_1.USERS_ROUTES.CHANGE_ROLE),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Change role for users. Only for admin user' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiCreatedResponse)({ type: user_entity_1.UserEntity }),
    __param(0, (0, common_1.Param)('id', CheckUserExist_pipe_1.CheckUserExistPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_role_dto_1.UpdateUserRole]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Delete)(site_constants_1.USERS_ROUTES.DELETE_MY_ACCOUNT),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete my account. Only for User' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.UserEntity }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeMyAccount", null);
__decorate([
    (0, common_1.Put)(site_constants_1.USERS_ROUTES.BAN_USER_ACCOUNT),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Ban account user' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('id', CheckUserExist_pipe_1.CheckUserExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "banUser", null);
__decorate([
    (0, common_1.Post)(site_constants_1.USERS_ROUTES.UPLOAD_AVATAR_USER),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload file' }),
    (0, swagger_1.ApiBody)({
        description: 'File upload',
        type: file_upload_dto_1.FileUploadDto,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadImage", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(site_constants_1.USERS_CONTROLLER),
    (0, swagger_1.ApiTags)('Users'),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], UsersController);
//# sourceMappingURL=users.controller.js.map