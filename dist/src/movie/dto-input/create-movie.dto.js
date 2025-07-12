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
exports.CreateMovieDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let CreateMovieDto = class CreateMovieDto {
    title;
    description;
    category;
    year;
    actorsList;
    published = false;
};
exports.CreateMovieDto = CreateMovieDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(5),
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Title movie' }),
    (0, class_validator_1.Length)(2, 30, { message: 'Name must be between 2 and 30 characters' }),
    (0, swagger_1.ApiProperty)({ required: true, description: 'Title Movie' }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, graphql_1.Field)(() => String, {
        nullable: false,
        description: 'Description about movie',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(10, 350, {
        message: 'Description must be between 10 and 350 characters',
    }),
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Movie Description',
        example: 'Inception',
    }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Movie category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Movie category',
        example: 'Science Fiction',
    }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Year' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], CreateMovieDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, graphql_1.Field)(() => [String], { nullable: false, description: 'List of actors' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Actors array should not be empty' }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'List of actors',
        example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    }),
    __metadata("design:type", Array)
], CreateMovieDto.prototype, "actorsList", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, {
        nullable: true,
        defaultValue: false,
        description: 'Published status',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        required: false,
        default: false,
        description: 'Movie publication status',
    }),
    __metadata("design:type", Boolean)
], CreateMovieDto.prototype, "published", void 0);
exports.CreateMovieDto = CreateMovieDto = __decorate([
    (0, graphql_1.InputType)()
], CreateMovieDto);
//# sourceMappingURL=create-movie.dto.js.map