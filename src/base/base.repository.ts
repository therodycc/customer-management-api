import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/base/repository.interface';
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Base } from './entities/base.entity';

@Injectable()
export class BaseRepository<TEntity extends Base> implements IRepository<TEntity> {
  constructor(
    private readonly repository: Repository<TEntity>, 
  ) {}

  findAllPaginated(options: FindManyOptions<TEntity>): Promise<[TEntity[], number]> {
    return this.repository.findAndCount(options);
  }

  create(payload: DeepPartial<TEntity>): Promise<TEntity> {
    const entityInstance = this.repository.create(payload);
    return this.repository.save(entityInstance);
  }

  async findOne(options: FindOneOptions<TEntity>): Promise<TEntity | null> {
    return this.repository.findOne(options);
  }

  async findAll(options: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.repository.find(options);
  }

  async update(id: number, payload: QueryDeepPartialEntity<TEntity>): Promise<TEntity | null> {
    await this.repository.update(id, payload);
    return this.findOne({ where: { id } } as any);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
