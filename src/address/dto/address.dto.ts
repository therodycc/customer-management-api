import { AutoMap } from '@automapper/classes';
import { BaseDto } from '@src/base/dto/base.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressDto extends BaseDto {
  @IsString()
  @AutoMap()
  name: string;

  @IsOptional()
  @IsString()
  @AutoMap()
  references: string;

  @IsString()
  @AutoMap()
  province: string;

  @IsString()
  @AutoMap()
  address: string;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  lat: number;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  long: number;
}
export class UserAddressDto extends AddressDto {}

export class CenterAddressDto extends AddressDto {}
