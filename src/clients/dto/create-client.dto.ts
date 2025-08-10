import { Gender } from '@src/common/enums/gender.enum';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  completeName: string;

  @IsString()
  identity: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsIn(Object.values(Gender))
  gender: Gender;

  @IsStrongPassword()
  @MaxLength(50)
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  birthDate?: Date;
}
