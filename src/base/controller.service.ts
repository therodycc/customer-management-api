import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MESSAGE } from '@src/shared/global/message';
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
} from 'typeorm';
import { BaseMapper } from './base.mapper';
import { BaseService } from './base.service';
import { BaseDto } from './dto/base.dto';
import { Orders, RequestPaginatedDto } from './dto/request-paginated.dto';
import { ResponsePaginated } from './dto/response-paginated.dto';
import { Base } from './entities/base.entity';

@Injectable()
export class ControllerService<TDto extends BaseDto, TEntity extends Base> {
  private readonly _mapper: BaseMapper<TEntity, TDto>;
  constructor(
    mapper: BaseMapper<TEntity, TDto>,
    private readonly baseService: BaseService<TEntity>,
  ) {
    this._mapper = mapper;
  }

  async getAll(options?: FindManyOptions<TEntity>): Promise<TDto[]> {
    try {
      const data = await this.baseService
        .findAll({
          order: this.buildOrder('createdAt', Orders.ASC),
          ...options,
        })
        .then((res) => {
          return this._mapper.arrayMapToDto(res);
        })
        .catch((err) => {
          throw new HttpException(
            `${MESSAGE.BASE.ERROR_FETCHING_ALL}: ${err.message}`,
            err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      return data;
    } catch (ex) {
      throw ex;
    }
  }

  async getAllPaginated(
    requestPaginated: RequestPaginatedDto<TEntity>,
    relations?: FindOptionsRelations<TEntity>,
  ): Promise<ResponsePaginated<TDto>> {
    try {
      const {
        paginator,
        filters,
        searchKeyword = '',
        searchKeys = [],
        dates,
      } = requestPaginated;

      const { page, limit, sort, order } = paginator;

      const whereFilters = {
        ...filters,
        ...(dates && {
          createdAt: Between(
            `${dates.startDate}T00:00:00.000Z`,
            `${dates.endDate}T23:59:59.999Z`,
          ),
        }),
      };

      const query: FindManyOptions<TEntity> = {
        skip: page * limit,
        take: limit,
        ...(sort && {
          order: this.baseService.buildOrder(sort as keyof TEntity, order),
        }),
        where: whereFilters,
        relations,
      };

      if (searchKeyword && searchKeys?.length) {
        const whereQueries = searchKeys.map((key) => {
          return {
            ...whereFilters,
            [key]: ILike(`%${searchKeyword}%`) as FindOperator<string>,
          };
        });
        query.where = whereQueries as FindOptionsWhere<TEntity>[];
      }

      const [result, total] = await this.baseService.findAllPaginated(query);

      const totalPages = Math.ceil(total / limit);
      const currentPage = page;
      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      const mappedResult = this._mapper.arrayMapToDto(result);

      return new ResponsePaginated<TDto>(
        mappedResult,
        total,
        totalPages,
        currentPage,
        nextPage,
        previousPage,
      );
    } catch (ex) {
      throw ex;
    }
  }

  async getOne(query: FindOneOptions<TEntity>): Promise<TDto> {
    try {
      const data = await this.baseService
        .findOne(query)
        .then((res) => {
          return this._mapper.mapToDto(res);
        })
        .catch((err) => {
          throw new HttpException(
            `${MESSAGE.BASE.ERROR_FETCHING_ONE}: ${err.message}`,
            err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
      return data;
    } catch (ex) {
      throw ex;
    }
  }

  buildOrder<T>(sort: keyof T, order: Orders): FindOptionsOrder<T> {
    return { [sort]: order } as FindOptionsOrder<T>;
  }
}
