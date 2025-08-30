import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserCommand } from '../commands/CreateUser.command';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { BadRequestException } from '@nestjs/common';
import { roundsOfHashing, tempRegisterDate } from '@/data/defaultData';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly mailService: MailService,
    ) {}

    async execute(command: CreateUserCommand) {
        const { createUserDto } = command;

        if (createUserDto.password !== createUserDto.passwordConfirm) {
            throw new BadRequestException('Confirm password');
        }

        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            roundsOfHashing,
        );
        const token = randomBytes(32).toString('hex');
        createUserDto.password = hashedPassword;
        let email = createUserDto.email;

        // console.log(email);

        const userEmail = await this.authRepository.findUser({ email });

        if (userEmail) {
            throw new BadRequestException(
                'User already exists with this email',
                {
                    cause: new Error(),
                    description: 'Try another email',
                },
            );
        }

        const userData = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
        };

        const createdUser = await this.authRepository.createUser(userData);

        const userId = createdUser.id;
        
        const emailVerificationToken = await this.authRepository.createToken({
            userId,
            token,
            tempDate: tempRegisterDate,
        });

        await this.mailService.sendEmail(
            true,
            {
                ...createdUser,
                email: createUserDto.email,
            },
            'Welcome to Movie App! Confirm your Email ',
            './confirmation',
            emailVerificationToken,
        );

        return {
            id: userId,
            email: createUserDto.email,
            name: createUserDto.name,
            accessToken: emailVerificationToken.token,
        };
    }
}
