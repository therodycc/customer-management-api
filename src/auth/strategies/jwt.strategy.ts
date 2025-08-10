import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@src/user/entities/user.entity';
import { UserRepository } from '@src/user/user.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadI } from './jwt.interface';
import { ConfigService } from '@src/config/config.service';
import { CookieService } from '../helpers/cookie/cookie.service';
import { MESSAGE } from '@src/shared/global/message';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private readonly configService: ConfigService,
    private cookiesService: CookieService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) =>
          this.cookiesService.getCookie(
            req,
            this.configService.cookieConstants.name,
          ),
      ]),
    });
  }

  async validate(payload: JwtPayloadI): Promise<User> {
    const { uuid } = payload;

    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['photo'],
    });

    if (!user) throw new UnauthorizedException(MESSAGE.AUTH.INVALID_TOKEN);

    // if (!user.active)
    //   throw new UnauthorizedException(MESSAGE.AUTH.USER_INACTIVE);

    return user;
  }
}
