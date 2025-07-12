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
exports.ChangeRoleHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./../repositories/users.repository");
const commands_1 = require("../commands");
let ChangeRoleHandler = class ChangeRoleHandler {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        const { id, updateUserRoleDto } = command;
        const user = await this.usersRepository.findIdUser(id);
        if (!user) {
            throw new common_1.NotFoundException('No user found');
        }
        if (user.roles?.includes('Admin')) {
            throw new common_1.ForbiddenException('Admin cannot change their own role');
        }
        const updatedRoles = Array.from(new Set([...updateUserRoleDto.roles, 'User']));
        const role = await this.usersRepository.updateUserRole(id, updatedRoles);
        return role;
    }
};
exports.ChangeRoleHandler = ChangeRoleHandler;
exports.ChangeRoleHandler = ChangeRoleHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.ChangeRoleCommand),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], ChangeRoleHandler);
//# sourceMappingURL=ChangeRole.handler.js.map