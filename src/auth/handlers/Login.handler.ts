import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { LoginUserCommand } from '../commands/LoginUser.command';
import { AuthRepository } from '../repositories/Auth.repository';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isDevelopment, tempLoginDate } from '@/data/defaultData';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private jwtService: JwtService,
    ) {}

    async execute(command: LoginUserCommand) {
        const { req, res, logInDto } = command;

        const user = await this.authRepository.findUser({ logInDto });

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

        let newRefreshTokenArray = !cookies?.jwtMovie
            ? user.refreshToken
            : user.refreshToken.filter((refT) => refT !== cookies?.jwtMovie);

        if (cookies.jwtMovie) {
            const refreshToken = cookies.jwtMovie;

            const existingRefreshToken =
                await this.authRepository.findFirstUser(user, refreshToken);

            if (!existingRefreshToken) {
                newRefreshTokenArray = [];
            }
            res.clearCookie('jwtMovie');
            // console.log(existingRefreshToken);
        }

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        await this.authRepository.deleteToken(user);

        await this.authRepository.createToken(
            user,
            refreshToken,
            tempLoginDate,
        );

        await this.authRepository.updateUser(
            user,
            newRefreshTokenArray,
            newRefreshToken,
        );

        res.cookie('jwtMovie', newRefreshToken, {
            httpOnly: isDevelopment ? false : true,
            sameSite: isDevelopment ? 'none' : 'strict',
            maxAge: 31 * 24 * 60 * 60 * 1000,
            secure: isDevelopment ? false : true,
        });
        return res.json({
            message: 'Login successful',
            accessToken: newRefreshToken,
            user: {
                id: user.id,
                name: user.name,
                roles: user.roles,
            },
        });
        // return isPasswordValid;
    }
}
