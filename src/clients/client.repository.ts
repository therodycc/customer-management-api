import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/base/repository.interface';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientRepository implements IRepository<Client> {
  findAllPaginated(options: FindManyOptions<Client>): Promise<[Client[], number]> {
    return Client.findAndCount(options);
  }

  create(payload: DeepPartial<Client>) {
    return Client.create(payload).save();
  }

  async findOne(options: FindOneOptions<Client>): Promise<Client> {
    return Client.findOne(options);
  }

  async findAll(options: FindManyOptions<Client>): Promise<Client[]> {
    return Client.find(options);
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<Client>,
  ): Promise<Client> {
    await Client.create({ id, ...payload }).save();
    return this.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
    return Client.delete(id);
  }

  async count(options?: FindManyOptions<Client>): Promise<number> {
    return Client.count(options);
  }
}
