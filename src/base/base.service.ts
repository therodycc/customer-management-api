import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGE } from '@src/shared/global/message';
import { User } from '@src/user/entities/user.entity';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Orders } from './dto/request-paginated.dto';
import { Base } from './entities/base.entity';
import { IRepository } from './repository.interface';

@Injectable()
export class BaseService<TEntity extends Base> {
  private readonly _repository: IRepository<TEntity>;
  constructor(repository: IRepository<TEntity>) {
    this._repository = repository;
  }

  async create(entity: DeepPartial<TEntity>) {
    const response = await this._repository.create(entity);

    if (!response)
      throw new HttpException(
        MESSAGE.BASE.CANT_CREATED_THE_RESOURCE,
        HttpStatus.BAD_REQUEST,
      );

    return response;
  }

  findAll(query?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this._repository.findAll(query);
  }

  findAllPaginated(
    query?: FindManyOptions<TEntity>,
  ): Promise<[TEntity[], number]> {
    return this._repository?.findAllPaginated(query);
  }

  async findOne(query: FindOneOptions<TEntity>): Promise<TEntity> {
    const result = await this._repository.findOne(query);
    return result;
  }

  async update(
    uuid: string,
    entity: QueryDeepPartialEntity<TEntity>,
    user?: User,
  ) {
    const result = await this.findOne({
      where: { uuid },
    } as FindManyOptions<TEntity>);

    if (!result) throw new NotFoundException(MESSAGE.BASE.RESOURCE_NOT_FOUND);

    return await this._repository.create({
      id: result?.id,
      ...entity,
      ...(user && {
        modifiedBy: user.id.toString(),
        modifiedAt: new Date(),
      }),
    } as DeepPartial<TEntity>);
  }

  async remove(uuid: string) {
    const result = await this.findOne({
      where: { uuid },
    } as FindManyOptions<TEntity>);
    if (!result) throw new NotFoundException(MESSAGE.BASE.RESOURCE_NOT_FOUND);
    return await this._repository.remove(result?.id);
  }

  async removeFromListOfReturned(uuid: string, user?: User) {
    await this.update(
      uuid,
      {
        deletedAt: new Date(),
      } as any,
      user,
    );

    return {
      ok: HttpStatus.OK,
      message: MESSAGE.BASE.SUCCESSFULLY_DELETED,
    };
  }

  buildOrder<T>(sort: keyof T, order: Orders): FindOptionsOrder<T> {
    return { [sort]: order } as FindOptionsOrder<T>;
  }

  async updateMultiple(
    uuids: FindOptionsWhere<TEntity> | string[],
    entity: QueryDeepPartialEntity<TEntity>,
    user?: User,
  ) {
    let whereCondition: FindOptionsWhere<TEntity>;

    if (Array.isArray(uuids)) {
      whereCondition = { uuid: In(uuids) } as FindOptionsWhere<TEntity>;
    } else {
      whereCondition = uuids;
    }

    if (user) {
      entity = {
        ...entity,
        modifiedBy: user.id.toString() as any,
        modifiedAt: new Date() as any,
      };
    }

    const updateResult = await this._repository.updateMultiple(
      whereCondition,
      entity,
    );

    return updateResult;
  }

  async count(options?: FindManyOptions<TEntity>): Promise<number> {
    return await this._repository.count(options);
  }
}
