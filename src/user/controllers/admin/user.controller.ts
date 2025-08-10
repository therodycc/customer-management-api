import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { BaseController } from '@src/base/base.controller';
import { Auth } from '@src/common/decorators';
import { Roles } from '@src/common/enums/roles.enum';
import { MESSAGE } from '@src/shared/global/message';
import { CreateUserDto } from '@src/user/dto/create-user.dto';
import { UpdateUserDto } from '@src/user/dto/update-user.dto';
import { UserDto } from '@src/user/dto/user.dto';
import { User } from '@src/user/entities/user.entity';
import { UserMapper } from '@src/user/mapper/user.mapper';
import { UserService } from '../../services/user.service';

@ApiCookieAuth()
@Auth(Roles.Admin, Roles.Super)
@ApiTags('Admin | Users')
@Controller('admin/users')
export class UserAdminController extends BaseController<UserDto, User> {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {
    super(userMapper, userService);
  }

  @Get(':uuid')
  getUserByUuid(@Param('uuid') uuid: string): Promise<User> {
    return this.userService.findOne({ where: { uuid }, relations: ['photo'] });
  }

  @Post()
  @ApiCreatedResponse({ description: MESSAGE.BASE.CREATED_SUCCESSFULLY })
  @ApiUnprocessableEntityResponse({ description: MESSAGE.BASE.BAD_REQUEST })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.createIfUserNotExists(dto);
  }

  @Put(':uuid')
  @ApiOkResponse({
    description: MESSAGE.BASE.THE_RESOURCE_WAS_UPDATED_SUCCESSFULLY,
  })
  @ApiNotFoundResponse({ description: MESSAGE.BASE.RESOURCE_NOT_FOUND })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: MESSAGE.BASE.BAD_REQUEST })
  async update(@Param('uuid') uuid: string, @Body() dto: UpdateUserDto) {
    return await this.userService.updateAndVerified(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOkResponse({
    description: MESSAGE.BASE.THE_RESOURCE_WAS_REMOVED_SUCCESSFULLY,
  })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  @ApiNotFoundResponse({ description: MESSAGE.BASE.RESOURCE_NOT_FOUND })
  override async remove(@Param('uuid') uuid: string) {
    return await this.userService.removeFromListOfReturned(uuid);
  }
}
