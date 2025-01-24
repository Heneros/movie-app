import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LogInDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { TimeoutInterceptor } from 'src/interceptor/timeout.interceptor';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(TimeoutInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserEntity,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    // console.log('create', createUserDto);
    return new UserEntity(await this.authService.create(createUserDto));
  }

  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LogInDto) {
    return this.authService.login(email, password);
  }

  @Get('verify/:emailToken/:userId')
  @ApiCreatedResponse({
    status: 200,
    description: 'The user has been successfully verified email.',
    type: UserEntity,
  })
  verifyEmail(
    @Param() { userId, emailToken }: VerifyEmailDto,
    @Res() res: Response,
  ) {
    this.authService.verifyEmail(userId, emailToken);
    // res.redirect('/auth/login');
    setTimeout(() => {
      console.log('redirect');
      // res.redirect('/auth/login');
    }, 1500);
  }

  // logout(@Body() {}) {
  //   return this.authService.logout();
  // }
}
