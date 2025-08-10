import { Gender } from '@src/common/enums/gender.enum';
import {
  IsEmail,
  IsIn,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangeEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @MaxLength(50)
  @MinLength(8)
  lastPassword: string;

  @IsStrongPassword()
  @MaxLength(50)
  @MinLength(8)
  password: string;

  @IsStrongPassword()
  @MaxLength(50)
  @MinLength(8)
  confirmPassword: string;
}

export class SendRegisterDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MaxLength(50)
  @MinLength(8)
  password: string;
}

export class RegisterInfoDto {
  @IsString()
  completeName: string;

  @IsString()
  identity: string;

  @IsString()
  phoneNumber: string;

  @IsIn(Object.values(Gender))
  gender: Gender;

  @IsString()
  birthDate: Date;
}

export class SendPhotoDto {}

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginAdminDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
