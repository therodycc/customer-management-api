import { AutoMap } from '@automapper/classes';

export class BaseDto {
  @AutoMap()
  uuid: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  modifiedAt: Date;
}
export class BaseEmptyDto {}
