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
exports.BanUserAccountHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../repositories/users.repository");
const commands_1 = require("../commands");
let BanUserAccountHandler = class BanUserAccountHandler {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        const { id } = command;
        const userIsAdmin = await this.usersRepository.findIdUser(id);
        if (!userIsAdmin) {
            throw new common_1.NotFoundException('No user found');
        }
        if (userIsAdmin.roles?.includes('Admin')) {
            throw new common_1.ForbiddenException('Admin cannot ban their own account');
        }
        await this.usersRepository.banUserAccount(id);
        return `User was banned ${userIsAdmin.name}`;
    }
};
exports.BanUserAccountHandler = BanUserAccountHandler;
exports.BanUserAccountHandler = BanUserAccountHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.BanUserAccountCommand),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], BanUserAccountHandler);
//# sourceMappingURL=BanUserAccount.handler.js.map