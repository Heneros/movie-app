import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { LoginUserCommand } from '../commands/loginUser.command';
import { AuthRepository } from '../repositories/auth.repository';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
    ) {}

    async execute(command: LoginUserCommand) {
        const { logInDto, req } = command;

        const user = await this.authRepository.findUser(logInDto);

        const isPasswordValid = await bcrypt.compare(
            logInDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }
        const payload = { id: user.id, name: user.name, roles: user.roles };

        const newRefreshToken = await this.jwtService.signAsync(payload);
        const cookies = req.cookies;

        return isPasswordValid;
    }
}
