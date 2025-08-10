import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@src/base/base.mapper';
import { FileDto } from '../dto/file.dto';

@Injectable()
export class FileMapper extends BaseMapper<File, FileDto> {
  constructor(@InjectMapper() private mapper: Mapper) {
    super(mapper);
  }

  override mapToDto(entity: File): FileDto {
    return this.mapper.map<File, FileDto>(entity, File, FileDto);
  }

  override mapToEntity(dto: FileDto): File {
    return this.mapper.map<FileDto, File>(dto, FileDto, File);
  }

  override arrayMapToDto(entity: File[]): FileDto[] {
    return this.mapper.mapArray<File, FileDto>(entity, File, FileDto);
  }

  override arrayMapToEntity(dto: FileDto[]): File[] {
    return this.mapper.mapArray<FileDto, File>(dto, FileDto, File);
  }
}
