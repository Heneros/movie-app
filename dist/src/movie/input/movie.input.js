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
exports.MovieBasicInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let MovieBasicInput = class MovieBasicInput {
    movieId;
    userId;
};
exports.MovieBasicInput = MovieBasicInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: false, description: 'Id movie' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MovieBasicInput.prototype, "movieId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: false, description: 'Id user' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MovieBasicInput.prototype, "userId", void 0);
exports.MovieBasicInput = MovieBasicInput = __decorate([
    (0, graphql_1.InputType)()
], MovieBasicInput);
//# sourceMappingURL=movie.input.js.map