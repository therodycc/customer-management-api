import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@src/config/config.service';
import { FileModule } from '@src/files/file.module';
import { MailCenterModule } from '@src/shared/mail-center/mail-center.module';
import { RestClientModule } from '@src/shared/rest-client/rest-client.module';
import { UserService } from '@src/user/services/user.service';
import { UserRepository } from '@src/user/user.repository';
import { AuthAdminController } from './controllers/admin/auth.controller';
import { AuthController } from './controllers/auth.controller';
import { RegisterAuthUserController } from './controllers/register-auth.controller';
import { AuthCode } from './entities/auth-codes.entity';
import { SSOSession } from './entities/session.entity';
import { CookieService } from './helpers/cookie/cookie.service';
import { TokenService } from './helpers/token/token.service';
import { SocketAuthMiddleware } from './middlewares/socket-auth.middleware';
import { AuthCodeService } from './services/auth-code.service';
import { AuthService } from './services/auth.service';
import { RegisterAuthService } from './services/register-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [
    AuthController,
    RegisterAuthUserController,
    AuthAdminController,
  ],
  providers: [
    AuthService,
    TokenService,
    UserService,
    UserRepository,
    CookieService,
    JwtStrategy,
    AuthCodeService,
    RegisterAuthService,
    SocketAuthMiddleware,
  ],
  imports: [
    RestClientModule,
    MailCenterModule,
    TypeOrmModule.forFeature([SSOSession, AuthCode]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.jwtConstants.secret,
          signOptions: { expiresIn: configService.jwtConstants.expireTime },
        };
      },
    }),
    FileModule,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
    UserService,
    TokenService,
    SocketAuthMiddleware,
  ],
})
export class AuthModule {}
