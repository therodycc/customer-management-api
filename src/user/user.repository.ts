import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/base/repository.interface';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository implements IRepository<User> {
  findAllPaginated(options: FindManyOptions<User>): Promise<[User[], number]> {
    return User.findAndCount(options);
  }

  create(payload: DeepPartial<User>) {
    return User.create(payload).save();
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return User.findOne(options);
  }

  async findAll(options: FindManyOptions<User>): Promise<User[]> {
    return User.find(options);
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<User>,
  ): Promise<User> {
    await User.create({ id, ...payload }).save();
    return this.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
    return User.delete(id);
  }

  async count(options?: FindManyOptions<User>): Promise<number> {
    return User.count(options);
  }
}
