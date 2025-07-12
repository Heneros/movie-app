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
exports.UsersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./entities-objectType/user.entity");
const cqrs_1 = require("@nestjs/cqrs");
const queries_1 = require("./queries");
const class_transformer_1 = require("class-transformer");
const roles_decorator_1 = require("../decorators/roles.decorator");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../guards/auth.guard");
const CheckUserExist_pipe_1 = require("./pipe/CheckUserExist.pipe");
const ProfileOwner_guard_1 = require("../guards/ProfileOwner.guard");
const update_user_dto_1 = require("./dto-input/update-user.dto");
const commands_1 = require("./commands");
const update_user_role_dto_1 = require("./dto-input/update-user-role.dto");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const movie_entity_1 = require("../movie/entities-objectType/movie.entity");
const findAuthorMovie_query_1 = require("../movie/queries/findAuthorMovie.query");
let UsersResolver = class UsersResolver {
    commandBus;
    queryBus;
    pubSub;
    constructor(commandBus, queryBus, pubSub) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.pubSub = pubSub;
    }
    async findAllUsers(page) {
        const users = await this.queryBus.execute(new queries_1.FindAllUsersQuery(page));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, users);
    }
    async findAllBlocked(page) {
        return await this.queryBus.execute(new queries_1.GetAllBlockedUsersQuery(page));
    }
    async findIdUser(id) {
        const user = await this.queryBus.execute(new queries_1.GetIdUserQuery(id));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, user);
    }
    async updateUser(id, updateUserDto) {
        const result = await this.commandBus.execute(new commands_1.UpdateUserCommand(id, updateUserDto));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, result);
    }
    async deleteUser(id) {
        const result = await this.commandBus.execute(new commands_1.DeleteUserCommand(id));
        return result;
    }
    async changeRole(id, updateUserRole) {
        const result = await this.commandBus.execute(new commands_1.ChangeRoleCommand(id, updateUserRole));
        this.pubSub.publish('USER_ROLE_CHANGE', {
            userChangeRoleSubscribe: result,
        });
        return new user_entity_1.UserEntity(result);
    }
    async userChangeRoleSubscribe() {
        return this.pubSub.asyncIterableIterator('USER_ROLE_CHANGE');
    }
    async findUser(id) {
        return this.queryBus.execute(new queries_1.GetIdUserQuery(id));
    }
    async movies(user) {
        console.log('ResolveField: movies');
        const result = await this.queryBus.execute(new findAuthorMovie_query_1.FindAuthorMovieQuery(user.id));
        return result.map((movie) => new movie_entity_1.MovieEntity(movie));
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, graphql_1.Query)(() => [user_entity_1.UserEntity], {
        description: 'Return all users',
    }),
    __param(0, (0, graphql_1.Args)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, graphql_1.Query)(() => [user_entity_1.UserEntity], {
        description: 'Return all blocked users',
    }),
    __param(0, (0, graphql_1.Args)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "findAllBlocked", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => user_entity_1.UserEntity, {
        description: 'Get User by id',
    }),
    __param(0, (0, graphql_1.Args)('id', CheckUserExist_pipe_1.CheckUserExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "findIdUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity, {
        description: 'Get User by id',
    }),
    __param(0, (0, graphql_1.Args)('id', CheckUserExist_pipe_1.CheckUserExistPipe)),
    __param(1, (0, graphql_1.Args)('updateUserDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity, {
        description: 'Delete User by id',
    }),
    __param(0, (0, graphql_1.Args)('id', CheckUserExist_pipe_1.CheckUserExistPipe, common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, graphql_1.Mutation)(() => user_entity_1.UserEntity, {
        description: 'Change Role User',
    }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_role_dto_1.UpdateUserRole]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "changeRole", null);
__decorate([
    (0, graphql_1.Subscription)(() => user_entity_1.UserEntity, {
        name: 'userChangeRoleSubscribe',
        resolve: (payload) => {
            return payload.userChangeRoleSubscribe;
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userChangeRoleSubscribe", null);
__decorate([
    (0, graphql_1.Query)(() => user_entity_1.UserEntity),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "findUser", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [movie_entity_1.MovieEntity]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "movies", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, graphql_1.Resolver)((of) => user_entity_1.UserEntity),
    __param(2, (0, common_1.Inject)('PUB_SUB')),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        graphql_subscriptions_1.PubSub])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map