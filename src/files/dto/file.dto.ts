import { IsString } from 'class-validator';

export class FileDto {
  @IsString()
  url: string;
}
