import {
  Controller,
  Put,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiTags
} from '@nestjs/swagger';
import { Auth, GetUser } from '@src/common/decorators';
import { Roles } from '@src/common/enums/roles.enum';
import { UserDto } from '@src/user/dto/user.dto';
import { User } from '@src/user/entities/user.entity';
import { UserMapper } from '@src/user/mapper/user.mapper';

import { FileInterceptor } from "@nestjs/platform-express";
import { ControllerService } from '@src/base/controller.service';
import { BufferedFile } from "@src/shared/minio-client/file.model";
import { UserService } from '../services/user.service';

@ApiCookieAuth()
@Auth(Roles.User)
@ApiTags('Users')
@Controller('users')
export class UserController extends ControllerService<UserDto, User> {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {
    super(userMapper, userService);
  }

  @Put('update-photo')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @GetUser() user: User,
    @UploadedFile() file: BufferedFile
  ) {
    return await this.userService.updateUserPhoto(file, user);
  }
}
