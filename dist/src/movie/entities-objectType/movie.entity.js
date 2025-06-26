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
exports.MovieEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities-objectType/user.entity");
const graphql_1 = require("@nestjs/graphql");
const update_user_dto_1 = require("../../users/dto-input/update-user.dto");
let MovieEntity = class MovieEntity {
    id;
    title;
    description;
    category;
    preview;
    published;
    createdAt;
    updatedAt;
    authorId;
    previewId;
    author;
    actorsList;
    movieId;
    userId;
    galleryId;
    avgRating;
    year;
    constructor({ author, ...data }) {
        Object.assign(this, data);
        if (author) {
            this.author = new update_user_dto_1.UpdateUserDto(author);
        }
    }
};
exports.MovieEntity = MovieEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MovieEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], MovieEntity.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], MovieEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], MovieEntity.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], MovieEntity.prototype, "preview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], MovieEntity.prototype, "published", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], MovieEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], MovieEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "previewId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: user_entity_1.UserEntity }),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", update_user_dto_1.UpdateUserDto)
], MovieEntity.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], MovieEntity.prototype, "actorsList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "movieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "galleryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "avgRating", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieEntity.prototype, "year", void 0);
exports.MovieEntity = MovieEntity = __decorate([
    (0, graphql_1.ObjectType)({ description: 'Movie' }),
    __metadata("design:paramtypes", [Object])
], MovieEntity);
//# sourceMappingURL=movie.entity.js.map