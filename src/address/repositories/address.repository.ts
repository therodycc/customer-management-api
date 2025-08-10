import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/base/repository.interface';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressRepository implements IRepository<Address> {
  create(payload: DeepPartial<Address>) {
    return Address.create(payload).save();
  }

  async findOne(options: FindOneOptions<Address>): Promise<Address> {
    return Address.findOne(options);
  }

  async findAll(options: FindManyOptions<Address>): Promise<Address[]> {
    return Address.find(options);
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<Address>,
  ): Promise<Address> {
    await Address.create({ id, ...payload }).save();
    return this.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
    return Address.delete(id);
  }
}
