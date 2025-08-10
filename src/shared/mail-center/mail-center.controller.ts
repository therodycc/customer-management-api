import { Body, Controller, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/common/decorators';
import { Roles } from '@src/common/enums/roles.enum';
import { MESSAGE } from '../global/message';
import { IMailBody } from './mail-center.models';
import { MailCenterService } from './mail-center.service';

@ApiCookieAuth()
@Auth(Roles.Super, Roles.Admin)
@Controller('admin/mailCenter')
@ApiTags('Mail center')
export class MailCenterController {
  constructor(private readonly mailService: MailCenterService) {}

  @Post('sendMail')
  async sendMail(@Body() req: IMailBody): Promise<any> {
    await this.mailService.sendMail(req);
    return { message: '' };
  }
}
