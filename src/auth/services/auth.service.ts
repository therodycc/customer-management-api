import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { generatePassword } from '@src/base/utils/empty-object.util';
import { Gender } from '@src/common/enums/gender.enum';
import { Roles } from '@src/common/enums/roles.enum';
import { ConfigService } from '@src/config/config.service';
import { MESSAGE } from '@src/shared/global/message';
import { MailCenterService } from '@src/shared/mail-center/mail-center.service';
import { RestClientService } from '@src/shared/rest-client/rest-client.service';
import { User } from '@src/user/entities/user.entity';
import { UserService } from '@src/user/services/user.service';
import { UserRepository } from '@src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { Not } from 'typeorm';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginAdminDto,
  LoginDto,
} from '../dto/register.dto';
import { CookieService } from '../helpers/cookie/cookie.service';
import { TokenService } from '../helpers/token/token.service';
import {
  IdentityInfoI,
  IdentityNewResponse,
} from '../interfaces/identity.interface';
import { SessionSSO, TokenData } from '../interfaces/sso.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private configService: ConfigService,
    private userService: UserService,
    private restClientService: RestClientService,
    private mailCenterService: MailCenterService,
  ) {}

  async login(payload: LoginDto, res: Response, req: Request, role: Roles) {
    const userDB = await this.userRepository.findOne({
      where: { email: payload.email, role: Roles.User },
    });

    if (userDB?.role !== role)
      throw new UnauthorizedException(MESSAGE.AUTH.INVALID_CREDENTIALS);

    if (!userDB)
      throw new UnauthorizedException(MESSAGE.AUTH.INVALID_CREDENTIALS);

    if (!bcrypt.compareSync(payload.password, userDB.password))
      throw new UnauthorizedException(MESSAGE.AUTH.INVALID_CREDENTIALS);

    const token: string = this.tokenService.signInToken({ uuid: userDB.uuid });

    //TODO:  save user session in the database

    this.cookieService.setCookies(res, req, token);

    return { ok: true };
  }

  async adminLogin(payload: LoginAdminDto, res: Response, req: Request) {
    const userSSO = await this.restClientService.sendRequest<SessionSSO>({
      url: this.configService.get('AUTH_SSO_API_URL'),
      method: 'POST',
      action: '',
      config: undefined,
      body: {
        applicationSecret: this.configService.get('JWT_SECRET'),
        username: payload.email,
        password: payload.password,
      },
    });

    if (!userSSO.success && !userSSO?.accessToken)
      throw new UnauthorizedException(
        userSSO.message || MESSAGE.AUTH.INVALID_CREDENTIALS,
      );

    const tokenData: TokenData =
      await this.tokenService.getTokenData<TokenData>(userSSO.accessToken);

    let userResult = await this.userRepository.findOne({
      where: [{ userName: payload.email, role: Roles.Admin }],
    });

    if (!userResult) {
      userResult = await this.userRepository.create({
        completeName: userSSO.completeName.toUpperCase(),
        email: tokenData.sub || userSSO.userName,
        userName: userSSO.userName,
        role: Roles.Admin,
        password: payload.password,
        active: true,
        isValid: true,
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const token: string = this.tokenService.signInToken(
      { uuid: userResult.uuid },
      { expiresIn: tokenData.exp - currentTime },
    );

    this.cookieService.setCookies(res, req, token);

    return { ok: true };
  }

  logout(res: Response, req: Request) {
    this.cookieService.clearCookies(res, req);
    //TODO:  remove user session in the database
    return {
      message: MESSAGE.AUTH.SESSION_CLOSED,
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user)
      return {
        message: MESSAGE.AUTH.EMAIL_CORRECTLY,
      };

    const passwordGenerated = generatePassword(15);

    await this.userService.update(user.uuid, {
      password: passwordGenerated,
    });

    await this.mailCenterService.sendMail({
      to: user.email,
      subject: 'Portal de : Solictud de cambio de contraseña',
      templateName: 'ForgotPasswordEmail',
      variables: {
        password: passwordGenerated,
      },
    });

    return {
      message: MESSAGE.AUTH.EMAIL_CORRECTLY,
    };
  }

  async changePassword(payload: ChangePasswordDto, user: User) {
    if (!bcrypt.compareSync(payload.lastPassword, user.password))
      throw new UnauthorizedException(MESSAGE.AUTH.INVALID_CREDENTIALS);

    if (payload.password !== payload.confirmPassword)
      throw new UnauthorizedException(MESSAGE.AUTH.PASSWORDS_NOT_MATCH);

    if (payload.lastPassword === payload.password)
      throw new BadRequestException(MESSAGE.AUTH.DIFFERENT_PASSWORD_REQUIRED);

    await this.userService.update(user.uuid, {
      password: payload.password,
    });

    return {
      message: MESSAGE.AUTH.THE_PASSWORD_WAS_CHANGED,
    };
  }

  async getUserInfoByIdentity(
    identity: string,
    user: User,
  ): Promise<IdentityInfoI> {
    const person =
      await this.restClientService.sendRequest<IdentityNewResponse>({
        url: `${this.configService.get('API_IDENTITY_URL')}/CC/${identity}`,
        method: 'GET',
        action: '',
        config: undefined,
      });

    const isAlreadyRegistered = await this.userRepository.findOne({
      where: {
        identity: identity.toString(),
        email: Not(user.email),
      },
    });

    if (isAlreadyRegistered) {
      throw new HttpException(
        MESSAGE.AUTH.THIS_ID_HAS_ALREADY_BEEN_REGISTERED,
        HttpStatus.CONFLICT,
      );
    }

    const {
      data: { birthDate, id, names, firstSurname, secondSurname, gender },
    } = person;

    const getGender = (key: string) =>
      ({
        M: Gender.Male,
        F: Gender.Female,
      })?.[key];

    return {
      birthDate,
      documentNumber: id,
      fullName: `${names} ${firstSurname} ${secondSurname}`,
      gender: getGender(gender),
    };
  }
}
