import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '@src/base/base.service';
import { FileService } from '@src/files/file.service';
import { BufferedFile } from '@src/shared/minio-client/file.model';
import {
  DataSource,
  DeepPartial,
  FindManyOptions
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private fileService: FileService,
    private readonly dataSource: DataSource,
  ) {
    super(userRepository);
  }

  async createIfUserNotExists(payload: DeepPartial<User>) {
    const userResult = await this.userRepository.findOne({
      where: [{ email: payload.email }, { identity: payload.identity }],
    });

    if (userResult)
      throw new HttpException(
        'This user already exits',
        HttpStatus.BAD_REQUEST,
      );

    return await this.create(payload);
  }

  async updateAndVerified(uuid: string, payload: QueryDeepPartialEntity<User>) {
    const user = await this.findOne({
      where: { uuid },
    } as FindManyOptions<User>);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (payload?.email && payload.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: payload.email as string },
      });

      if (emailExists) {
        throw new HttpException(
          'This email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (payload?.identity && payload.identity !== user.identity) {
      const identityExists = await this.userRepository.findOne({
        where: { identity: payload.identity as string },
      });

      if (identityExists) {
        throw new HttpException(
          'This identity already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.update(uuid, payload);
  }

  async updateUserPhoto(file: BufferedFile, user: User) {
    return await this.fileService.updateFile(user.photo.uuid, file);
  }
}
