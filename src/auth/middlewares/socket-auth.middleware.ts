import { Injectable, NestMiddleware } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@src/config/config.service';
import { UserRepository } from '@src/user/user.repository';
import { CookieService } from '../helpers/cookie/cookie.service';

@Injectable()
export class SocketAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly cookieService: CookieService,
  ) {}

  async use(client: Socket, next: (err?: any) => void) {
    try {
      const headers = client.handshake.headers;
      if (!headers.cookie) {
        return next(new Error('No cookies found'));
      }

      const token = this.cookieService.getCookie(
        headers,
        this.configService.cookieConstants.name,
      );

      if (!token) {
        return next(new Error('No auth token found'));
      }

      const payload = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as any;

      const user = await this.userRepository.findOne({
        where: { uuid: payload.uuid },
      });

      if (!user) {
        return next(new Error('Invalid token'));
      }

      (client as any).user = user;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  }
}
