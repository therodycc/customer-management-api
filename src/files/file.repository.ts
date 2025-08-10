import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/base/repository.interface';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { File } from './entities/file.entity';

@Injectable()
export class FileRepository implements IRepository<File> {
  findAllPaginated(options: FindManyOptions<File>): Promise<[File[], number]> {
    return File.findAndCount(options);
  }

  create(payload: DeepPartial<File>) {
    return File.create(payload).save();
  }

  async findOne(options: FindOneOptions<File>): Promise<File> {
    return File.findOne(options);
  }

  async findAll(options: FindManyOptions<File>): Promise<File[]> {
    return File.find(options);
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<File>,
  ): Promise<File> {
    await File.create({ id, ...payload }).save();
    return this.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
    return File.delete(id);
  }
}
