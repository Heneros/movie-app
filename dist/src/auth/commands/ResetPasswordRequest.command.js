"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordRequestCommand = void 0;
class ResetPasswordRequestCommand {
    userId;
    resendEmailDto;
    res;
    constructor(userId, resendEmailDto, res) {
        this.userId = userId;
        this.resendEmailDto = resendEmailDto;
        this.res = res;
    }
}
exports.ResetPasswordRequestCommand = ResetPasswordRequestCommand;
//# sourceMappingURL=ResetPasswordRequest.command.js.map