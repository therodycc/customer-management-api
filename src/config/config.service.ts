import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { CookieConstantsI, JWTConstantsI } from './config.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    const result = dotenv.config();

    if (result.error) {
      this.envConfig = process.env;
    } else {
      this.envConfig = result.parsed;
    }
  }

  public get<T>(key: string): T {
    return this.envConfig[key] as T;
  }

  public get authConfig() {
    return {
      ATTEMPTS: 3,
      LOCK_TIME: 10, // minutes
      OTP_TOKEN_EXPIRATION: 5, // minutes
      CONFIRM_ACCOUNT_EXPIRATION: 43200, // minutes(30 days)
      TOKEN_LENGTH: 6,
    };
  }

  public get jwtConstants(): JWTConstantsI {
    return {
      secret: this.get('JWT_SECRET'),
      expireTime: this.get('JWT_EXPIRE_TIME'),
    };
  }

  public get cookieConstants(): CookieConstantsI {
    const includeHttps = ['prod'].includes(this.get('NODE_ENV'));

    return {
      name: this.get('AUTH_COOKIES_NAME'),
      secure: includeHttps,
      //None ---> Requiere de que tengan su certificado https para permitir el Seteo de las cookies en diferentes dominios
      sameSite: includeHttps ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    };
  }

  public async getConfig(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: +this.get('DB_PORT'),
      database: this.get('DB_NAME'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
