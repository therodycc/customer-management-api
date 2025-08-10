import { Injectable } from '@nestjs/common';
import { CookieObjectI, UrlInterface } from './cookie.interface';
import { ConfigService } from '@src/config/config.service';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  getDomainFromRequest(req: Request) {
    const origin = (req?.headers as any)?.origin || 'http://localhost';
    const { hostname } = new URL(origin);
    return hostname;
  }

  getCookie(req: Request | IncomingHttpHeaders, name: string) {
    const data: CookieObjectI =
      (req as any)?.cookies || this.parseCookie((req as any)?.cookie);
    return data?.[name] || '';
  }

  setCookies(res: Response, req: Request, token: string, _name?: string) {
    const { name, maxAge, sameSite, secure } =
      this.configService.cookieConstants;

    const domain = this.getDomainFromRequest(req);

    return (res as any)?.cookie?.(_name || name, token, {
      maxAge,
      sameSite,
      secure,
      domain,
    });
  }

  clearCookies(res: Response, req: Request, _name?: string) {
    const { name, maxAge, sameSite, secure } =
      this.configService.cookieConstants;

    const domain = this.getDomainFromRequest(req);

    return (res as any).clearCookie(_name || name, {
      domain,
      httpOnly: true,
      sameSite,
      secure,
      expires: new Date(-1),
    });
  }

  private parseCookie(cookieString: string) {
    const cookieObj: { [key: string]: string } = {};
    if (cookieString) {
      const cookiesArray = cookieString.split('; ');

      cookiesArray.forEach((cookie) => {
        const [name, ...rest] = cookie.split('=');
        const value = rest.join('=');
        cookieObj[name] = decodeURIComponent(value);
      });

      return cookieObj;
    }
  }
}
