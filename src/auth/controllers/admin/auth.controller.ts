import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '@src/common/decorators';
import { Roles } from '@src/common/enums/roles.enum';
import { UserService } from '@src/user/services/user.service';
import { LoginAdminDto } from '../../dto/register.dto';
import { AuthService } from '../../services/auth.service';

@ApiTags('Auth')
@Controller('admin/auth')
export class AuthAdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Res() response: Response | any,
    @Req() request: Request,
    @Body() payload: LoginAdminDto,
  ) {
    const result = await this.authService.adminLogin(
      payload,
      response,
      request
    );
    return response.status(200).json(result);
  }

  @ApiCookieAuth()
  @Get('me')
  @Auth(Roles.Admin)
  getMe(@GetUser('uuid') userUuid: string) {
    return this.userService.findOne({ where: { uuid: userUuid } });
  }
}
