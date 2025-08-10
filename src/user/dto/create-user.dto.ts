import { Gender } from '@src/common/enums/gender.enum';
import { Roles } from '@src/common/enums/roles.enum';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  password?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  lastActivity?: Date;

  @IsString()
  birthDate?: Date;

  @IsIn(Object.values(Roles))
  role: Roles;
}
