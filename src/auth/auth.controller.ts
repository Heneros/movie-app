import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LogInDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { TimeoutInterceptor } from 'src/interceptor/timeout.interceptor';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(TimeoutInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LogInDto) {
    return this.authService.login(email, password);
  }
  // logout(@Body() {}) {
  //   return this.authService.logout();
  // }
}
