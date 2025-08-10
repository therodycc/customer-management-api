import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FileService } from '@src/files/file.service';
import { MESSAGE } from '@src/shared/global/message';
import { BufferedFile } from '@src/shared/minio-client/file.model';
import { User } from '@src/user/entities/user.entity';
import { UserService } from '@src/user/services/user.service';
import { UserRepository } from '@src/user/user.repository';
import {
  ChangeEmailDto,
  RegisterInfoDto,
  SendRegisterDto,
} from '../dto/register.dto';
import { CookieService } from '../helpers/cookie/cookie.service';
import { TokenService } from '../helpers/token/token.service';
import { AuthCodeService } from './auth-code.service';
import { Buckets, Folders } from '@src/common/enums/buckets.enum';

@Injectable()
export class RegisterAuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private userService: UserService,
    private authCodeService: AuthCodeService,
    private readonly fileService: FileService,
  ) {}

  async sendRegister(payload: SendRegisterDto, res: Response, req: Request) {
    const userExits = await this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (userExits)
      throw new HttpException(
        MESSAGE.AUTH.THIS_EMAIL_ALREADY_EXITS,
        HttpStatus.CONFLICT,
      );

    const user = await this.userService.create(payload);

    try {
      await this.authCodeService.create(user);
    } catch (error) {
      console.log(error);
    }

    const token: string = this.tokenService.signInToken({ uuid: user.uuid });
    //TODO:  save user session in the database
    this.cookieService.setCookies(res, req, token);

    return {
      message: MESSAGE.AUTH.EMAIL_SENT,
    };
  }

  async resendEmail(user: User) {
    if (user?.isValid)
      throw new HttpException(
        MESSAGE.AUTH.THE_EMAIL_WAS_ALREADY_VALID,
        HttpStatus.BAD_REQUEST,
      );
    await this.authCodeService.create(user);
    return {
      message: MESSAGE.AUTH.EMAIL_SENT,
    };
  }

  async changeEmail(payload: ChangeEmailDto, user: User) {
    if (user?.isValid)
      throw new HttpException(
        MESSAGE.AUTH.THE_EMAIL_WAS_ALREADY_VALID,
        HttpStatus.BAD_REQUEST,
      );
    const userResult = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (userResult)
      throw new HttpException(
        MESSAGE.AUTH.THIS_EMAIL_ALREADY_EXITS,
        HttpStatus.CONFLICT,
      );

    const userUpdated = await this.userService.update(user.uuid, payload);
    await this.authCodeService.create(user);

    return {
      user: userUpdated,
      message: MESSAGE.AUTH.THE_EMAIL_WAS_CHANGED_AND_EMAIL_WAS_SENT,
    };
  }

  async validateEmail(code: number, user: User) {
    if (user.isValid)
      throw new HttpException(
        MESSAGE.AUTH.THE_EMAIL_WAS_ALREADY_VALID,
        HttpStatus.CONFLICT,
      );

    const lastAuthCode = await this.authCodeService.getLastCodeByUser(user);

    if (Number(lastAuthCode.code) !== code)
      throw new HttpException(
        MESSAGE.AUTH.THIS_CODE_IS_NO_VALID,
        HttpStatus.BAD_REQUEST,
      );

    await this.userService.update(user.uuid, { isValid: true });

    return {
      message: MESSAGE.AUTH.THE_EMAIL_WAS_VALIDATED_CORRECTLY,
    };
  }

  async registerInfo(uuid: string, payload: RegisterInfoDto) {
    const user = await this.userRepository.findOne({
      where: { uuid },
    });

    if (!user?.isValid)
      throw new UnauthorizedException(MESSAGE.AUTH.THE_EMAIL_MUST_BE_VALIDATED);

    return this.userService.update(uuid, payload);
  }

  async sendPhoto(file: BufferedFile, user: User) {
    await this.userService.findOne({
      where: { uuid: user.uuid },
    });

    if (!user?.isValid)
      throw new UnauthorizedException(MESSAGE.AUTH.THE_EMAIL_MUST_BE_VALIDATED);

    const _file = await this.fileService.createFile(
      file,
      Buckets.AppFiles,
      Folders.UserPhotos,
    );

    const updated = await this.userService.update(user.uuid, {
      active: true,
      photo: {
        id: _file.id,
      },
    });

    return updated;
  }
}
