import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FindManyOptions } from 'typeorm';

export enum Orders {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginatorDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsIn(Object.values(Orders))
  @IsOptional()
  order?: Orders;
}

class DateFilterDto {
  @IsString()
  startDate: string | Date;
  @IsString()
  endDate: string | Date;
}

export class RequestPaginatedDto<T> {
  @IsString()
  @IsOptional()
  searchKeyword?: string;

  @IsOptional()
  searchKeys?: (keyof FindManyOptions<T>['where'])[];

  @IsOptional()
  @IsObject()
  // @ValidateNested()
  // @Type(() => FilterDto)
  filters?: FindManyOptions<T>['where'];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DateFilterDto)
  dates?: DateFilterDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PaginatorDto)
  paginator: PaginatorDto;

  @IsOptional()
  @IsString()
  categoryUuid?: string;

  @IsOptional()
  @IsString()
  provinceName?: string;
}
