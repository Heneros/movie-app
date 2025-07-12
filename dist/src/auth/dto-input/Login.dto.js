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
exports.LogInDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let LogInDto = class LogInDto {
    email;
    password;
};
exports.LogInDto = LogInDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String, { nullable: false, description: 'Email' }),
    (0, swagger_1.ApiProperty)({ example: 'exmple1@email.com' }),
    __metadata("design:type", String)
], LogInDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    (0, graphql_1.Field)(() => String, {
        nullable: false,
        description: 'Password minimum 6 symbols',
    }),
    (0, swagger_1.ApiProperty)({ example: '**********' }),
    __metadata("design:type", String)
], LogInDto.prototype, "password", void 0);
exports.LogInDto = LogInDto = __decorate([
    (0, graphql_1.InputType)()
], LogInDto);
//# sourceMappingURL=Login.dto.js.map