import { User } from '@src/user/entities/user.entity';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepository<Entity> {
  create(model: DeepPartial<Entity>): Promise<Entity>;
  findAll(options: FindManyOptions<Entity>): Promise<Entity[]>;
  findAllPaginated?: (
    options: FindManyOptions<Entity>,
  ) => Promise<[Entity[], number]>;
  findOne(options: FindOneOptions<Entity>): Promise<Entity>;
  update(
    id: number,
    model: QueryDeepPartialEntity<Entity>,
    user?: User,
  ): Promise<Entity>;
  remove(id: number): Promise<any>;
  updateMultiple?: (
    ids: FindOptionsWhere<Entity> | string[] | number[],
    model: QueryDeepPartialEntity<Entity>,
    user?: User,
  ) => Promise<UpdateResult>;
  count?: (options?: FindManyOptions<Entity>) => Promise<number>;
}
