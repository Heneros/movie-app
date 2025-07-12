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
exports.MovieReviewEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
let MovieReviewEntity = class MovieReviewEntity {
    id;
    review;
    positive;
    createdAt;
    total;
    constructor({ ...data }) {
        Object.assign(this, data);
    }
};
exports.MovieReviewEntity = MovieReviewEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], MovieReviewEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], MovieReviewEntity.prototype, "review", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], MovieReviewEntity.prototype, "positive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", Date)
], MovieReviewEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], MovieReviewEntity.prototype, "total", void 0);
exports.MovieReviewEntity = MovieReviewEntity = __decorate([
    (0, graphql_1.ObjectType)({ description: 'MovieReview' }),
    __metadata("design:paramtypes", [Object])
], MovieReviewEntity);
//# sourceMappingURL=movieReview.entity.js.map