import { Body, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BaseMapper } from './base.mapper';
import { BaseService } from './base.service';
import { ControllerService } from './controller.service';
import { BaseDto } from './dto/base.dto';
import { RequestPaginatedDto } from './dto/request-paginated.dto';
import { ResponsePaginated } from './dto/response-paginated.dto';
import { Base } from './entities/base.entity';
import { MESSAGE } from '@src/shared/global/message';
import { FindManyOptions, FindOptionsRelations } from 'typeorm';

export class BaseController<
  TDto extends BaseDto,
  TEntity extends Base,
> extends ControllerService<TDto, TEntity> {
  constructor(
    private readonly mapper: BaseMapper<TEntity, TDto>,
    private readonly service: BaseService<TEntity>,
  ) {
    super(mapper, service);
  }

  @Get()
  @ApiOkResponse({
    description: MESSAGE.BASE.THE_RESOURCES_WERE_RETURNED_SUCCESSFULLY,
  })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  @ApiNotFoundResponse({ description: MESSAGE.BASE.RESOURCE_NOT_FOUND })
  findAll(options?: FindManyOptions<TEntity>): Promise<TDto[]> {
    return this.getAll(options);
  }

  @Post('paginated')
  @ApiOkResponse({
    description: MESSAGE.BASE.THE_RESOURCES_WERE_RETURNED_SUCCESSFULLY,
  })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  @ApiNotFoundResponse({ description: MESSAGE.BASE.RESOURCE_NOT_FOUND })
  findAllPaginated(
    @Body() requestPaginated: RequestPaginatedDto<TEntity>,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<ResponsePaginated<TDto>> {
    return this.getAllPaginated(requestPaginated, relations);
  }

  @Get(':uuid')
  @ApiOkResponse({
    description: MESSAGE.BASE.THE_RESOURCE_WAS_RETURNED_SUCCESSFULLY,
  })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  @ApiNotFoundResponse({ description: MESSAGE.BASE.RESOURCE_NOT_FOUND })
  findOne(@Param('uuid') uuid: string): Promise<TDto> {
    return this.getOne({ where: { uuid: uuid as any } });
  }

  @Delete(':uuid')
  @ApiOkResponse({
    description: MESSAGE.BASE.THE_RESOURCE_WAS_RETURNED_SUCCESSFULLY,
  })
  @ApiForbiddenResponse({ description: MESSAGE.BASE.UNAUTHORIZED_REQUEST })
  @ApiNotFoundResponse({ description: MESSAGE.BASE.RESOURCE_NOT_FOUND })
  remove(@Param('uuid') uuid: string) {
    return this.service.remove(uuid);
  }
}
