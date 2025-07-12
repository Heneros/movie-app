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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const movie_entity_1 = require("../../movie/entities-objectType/movie.entity");
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let UserEntity = class UserEntity {
    id;
    createdAt;
    updatedAt;
    name;
    email;
    refreshToken;
    isEmailVerified;
    blocked;
    avatar;
    preview;
    googleId;
    githubId;
    discordId;
    roles;
    avatarId;
    provider;
    password;
    movies;
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: false }),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Date, { nullable: false }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Date, { nullable: false }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of user' }),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)((type) => [String], { nullable: false }),
    __metadata("design:type", Array)
], UserEntity.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "blocked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "preview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "githubId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "discordId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], UserEntity.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], UserEntity.prototype, "avatarId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "provider", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(() => [movie_entity_1.MovieEntity], { nullable: true }),
    __metadata("design:type", Array)
], UserEntity.prototype, "movies", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, graphql_1.ObjectType)({ description: 'User' }),
    __metadata("design:paramtypes", [Object])
], UserEntity);
//# sourceMappingURL=user.entity.js.map