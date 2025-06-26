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
exports.LogoutHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const Auth_repository_1 = require("../repositories/Auth.repository");
const commands_1 = require("../commands");
let LogoutHandler = class LogoutHandler {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(command) {
        const { req, res } = command;
        if (!req.session) {
            return res.status(400).json({ message: 'Session not found' });
        }
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(new Error('Failed to destroy session'));
                }
                else {
                    resolve();
                }
            });
        });
        res.clearCookie('jwtMovie');
        res.clearCookie('connect.sid');
        return 'Logged out successfully';
    }
};
exports.LogoutHandler = LogoutHandler;
exports.LogoutHandler = LogoutHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.LogoutCommand),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository])
], LogoutHandler);
//# sourceMappingURL=Logout.handler.js.map