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
exports.CreateUserDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let CreateUserDto = class CreateUserDto {
    name;
    email;
    password;
    passwordConfirm;
};
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Name of user' }),
    (0, swagger_1.ApiProperty)({ description: 'Name of User', example: 'qwerty' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Email of user' }),
    (0, swagger_1.ApiProperty)({
        description: 'email@test.com',
        example: 'qwerty@gmhail.com',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Password' }),
    (0, class_validator_1.MinLength)(6),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Confirm password' }),
    (0, class_validator_1.MinLength)(6),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "passwordConfirm", void 0);
exports.CreateUserDto = CreateUserDto = __decorate([
    (0, graphql_1.InputType)()
], CreateUserDto);
//# sourceMappingURL=Create-user.dto.js.map