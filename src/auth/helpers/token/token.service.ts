import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayloadI } from '@src/auth/strategies/jwt.interface';
import { ConfigService } from '@src/config/config.service';

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  signInToken(payload: JwtPayloadI, options?: JwtSignOptions) {
    if (!this.configService?.jwtConstants?.secret)
      throw new InternalServerErrorException('Secret key is not defined');
    return this.jwtService.sign(payload, options);
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        ignoreExpiration: true,
      });
    } catch (err) {
      this.errorHandler(err);
    }
  }

  getTokenData<T>(token: string): T | null {
    return this.jwtService.decode(token) || null;
  }

  errorHandler(err) {
    switch (err.name) {
      case 'TokenExpiredError':
        throw new UnauthorizedException('Token expired');
      case 'JsonWebTokenError':
        throw new UnauthorizedException('Invalid token signature');
      default:
        throw new InternalServerErrorException('Internal Token Server Error ');
    }
  }
}
