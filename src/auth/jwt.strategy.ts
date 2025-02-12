//@/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '@/data/defaultData';
// import { jwtSecret } from './auth.module';
import { UsersService } from '@/users/users.service';
import { GetIdUsersService } from '@/users/services/getIdUser.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private getIdUsersService: GetIdUsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.getIdUsersService.findOne(payload.userId);

    // console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
