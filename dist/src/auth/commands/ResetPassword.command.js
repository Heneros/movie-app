"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordCommand = void 0;
class ResetPasswordCommand {
    userId;
    emailToken;
    resetPasswordDto;
    constructor(userId, emailToken, resetPasswordDto) {
        this.userId = userId;
        this.emailToken = emailToken;
        this.resetPasswordDto = resetPasswordDto;
    }
}
exports.ResetPasswordCommand = ResetPasswordCommand;
//# sourceMappingURL=ResetPassword.command.js.map