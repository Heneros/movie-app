import { ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../commands/LoginUser.command';
import { AuthRepository } from '../repositories/Auth.repository';
import { JwtService } from '@nestjs/jwt';
export declare class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    execute(command: LoginUserCommand): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            roles: string[];
        };
    }>;
}
