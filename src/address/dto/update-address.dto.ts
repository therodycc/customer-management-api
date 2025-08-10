import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import { IsDate, IsOptional } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @IsDate()
  @IsOptional()
  deletedAt: Date;
}
