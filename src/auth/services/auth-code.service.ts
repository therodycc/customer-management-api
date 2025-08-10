import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCode } from '../entities/auth-codes.entity';
import { User } from '@src/user/entities/user.entity';
import { MailCenterService } from '@src/shared/mail-center/mail-center.service';

@Injectable()
export class AuthCodeService {
  constructor(
    @InjectRepository(AuthCode)
    private authCodeRepository: Repository<AuthCode>,
    private mailCenterService: MailCenterService,
  ) {}

  async create(user: User) {
    const result = this.authCodeRepository.create({
      code: Math.floor(100000 + Math.random() * 900000),
      user,
    });
    if (!result)
      throw new HttpException(
        `Can't created the auth code`,
        HttpStatus.BAD_REQUEST,
      );

    await this.mailCenterService.sendMail({
      to: user.email,
      subject: 'Portal de : Confirmación de registro',
      templateName: 'CodeEmail',
      variables: {
        code: result.code,
      },
    });

    return result.save();
  }

  async getLastCodeByUser(user: User) {
    const result = await this.authCodeRepository
      .createQueryBuilder('code')
      .where('code.userId = :userId', { userId: user.id })
      .orderBy('code.createdAt', 'DESC')
      .getOne();

    if (!result) throw new NotFoundException(`The user doesn't has any code`);

    return result;
  }
}
