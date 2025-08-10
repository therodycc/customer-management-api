import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from '@nestjs/swagger';
import {
  ChangeEmailDto,
  RegisterInfoDto,
  SendRegisterDto
} from '@src/auth/dto/register.dto';
import { Auth, GetUser } from '@src/common/decorators';
import { Roles } from '@src/common/enums/roles.enum';
import { BufferedFile } from "@src/shared/minio-client/file.model";
import { User } from '@src/user/entities/user.entity';
import { RegisterAuthService } from '../services/register-auth.service';

@ApiTags('Auth | User')
@Controller('auth')
export class RegisterAuthUserController {
  constructor(private readonly registerAuthService: RegisterAuthService) {}

  @Post('/send-register')
  async sendRegister(
    @Res() response: Response | any,
    @Req() request: Request | any,
    @Body() payload: SendRegisterDto,
  ) {
    const result = await this.registerAuthService.sendRegister(
      payload,
      response,
      request,
    );
    return response.status(200).json(result);
  }

  @Auth(Roles.User)
  @Post('/resend-email')
  async resendEmail(@GetUser() user) {
    return await this.registerAuthService.resendEmail(user);
  }

  @Auth(Roles.User)
  @Post('/change-email')
  changeEmail(@Body() payload: ChangeEmailDto, @GetUser() user: User) {
    return this.registerAuthService.changeEmail(payload, user);
  }

  @Auth(Roles.User)
  @Post('/validate-email/:code')
  validateEmail(@Param('code', ParseIntPipe) code, @GetUser() user: User) {
    return this.registerAuthService.validateEmail(code, user);
  }

  @Auth(Roles.User)
  @Post('register-info')
  registerInfo(@Body() payload: RegisterInfoDto, @GetUser() user: User) {
    return this.registerAuthService.registerInfo(user.uuid, {
      ...payload,
      birthDate: new Date(payload.birthDate),
    });
  }

  @Auth(Roles.User)
  @Post('send-photo')
  @UseInterceptors(FileInterceptor('file'))
  async sendPhoto(@UploadedFile() file: BufferedFile, @GetUser() user: User) {
    return await this.registerAuthService.sendPhoto(file, user);
  }
}
