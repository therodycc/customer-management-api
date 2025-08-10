import { AutoMap } from '@automapper/classes';
import { BaseDto } from '@src/base/dto/base.dto';
import { Gender } from '@src/common/enums/gender.enum';
import { Roles } from '@src/common/enums/roles.enum';
import { FileDto } from '@src/files/dto/file.dto';

export class UserDto extends BaseDto {
  @AutoMap()
  completeName: string;

  @AutoMap()
  identity: string;

  @AutoMap()
  email: string;

  @AutoMap()
  phoneNumber: string;

  @AutoMap()
  gender: Gender;

  @AutoMap()
  password?: string;

  @AutoMap()
  active?: boolean;

  @AutoMap()
  lastActivity?: Date;

  @AutoMap()
  birthDate?: Date;

  @AutoMap()
  role: Roles;

  @AutoMap()
  photo: FileDto;
}
