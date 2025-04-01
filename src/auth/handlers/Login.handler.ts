import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { LoginUserCommand } from '../commands/LoginUser.command';
import { AuthRepository } from '../repositories/Auth.repository';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(command: LoginUserCommand) {
        try {
            const { logInDto } = command;

            const user = await this.authRepository.findUser({ logInDto });

            const isPasswordValid = await bcrypt.compare(
                logInDto.password,
                user.password,
            );

            if (!isPasswordValid) {
                throw new BadRequestException('Invalid password');
            }
            const payload = {
                id: user.id,
                name: user.name,
                roles: user.roles,
            };

            const accessToken = await this.jwtService.signAsync(payload);
            const refreshToken = await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
            });

            await this.authRepository.updateToken(user.id, refreshToken);

            return {
                accessToken,
                refreshToken,
                // user,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                },
            };
        } catch (error) {
            console.error('Error setting cookie or sending response:', error);
        }

        // return isPasswordValid;
    }
}
