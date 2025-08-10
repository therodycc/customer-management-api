import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '@src/common/decorators';
import { Roles } from '@src/common/enums/roles.enum';
import { IdentityValidationPipe } from '@src/common/pipes/identity-validation';
import { UserService } from '@src/user/services/user.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
} from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('login')
  async login(
    @Res() response: Response | any,
    @Req() request: Request,
    @Body() payload: LoginDto,
  ) {
    const result = await this.authService.login(
      payload,
      response,
      request,
      Roles.User,
    );
    return response.status(200).json(result);
  }

  @Get('origins')
  async getOrigins() {
    return process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
      : [];
  }

  @Post('logout')
  async logout(@Res() response: Response | any, @Req() request: Request) {
    return response
      .status(200)
      .json(this.authService.logout(response, request));
  }

  @ApiCookieAuth()
  @Get('me')
  @Auth(Roles.User)
  getMe(@GetUser('uuid') userUuid) {
    return this.userService.findOne({
      where: { uuid: userUuid },
      relations: ['photo'],
    });
  }

  @Get('identity/:identity')
  @Auth()
  getAndValidateIdentityInfo(
    @Param('identity', IdentityValidationPipe) identity: string,
    @GetUser() user,
  ) {
    return this.authService.getUserInfoByIdentity(identity, user);
  }

  @Auth()
  @Post('change-password')
  changePassword(@Body() payload: ChangePasswordDto, @GetUser() user) {
    return this.authService.changePassword(payload, user);
  }

  @Post('forgot-password')
  forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }
}
