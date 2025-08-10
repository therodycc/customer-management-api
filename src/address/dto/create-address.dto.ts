import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  references: string;

  @IsString()
  province: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  lat: number;

  @IsOptional()
  @IsNumber()
  long: number;

  @IsOptional()
  @IsBoolean()
  isMain: boolean;
}
