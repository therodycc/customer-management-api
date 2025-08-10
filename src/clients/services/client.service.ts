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
import { Client } from '../entities/client.entity';
import { ClientRepository } from '../client.repository';

@Injectable()
export class ClientService extends BaseService<Client> {
  constructor(
    private readonly clientRepository: ClientRepository,
    private fileService: FileService,
    private readonly dataSource: DataSource,
  ) {
    super(clientRepository);
  }

  async createIfClientNotExists(payload: DeepPartial<Client>) {
    const clientResult = await this.clientRepository.findOne({
      where: [{ email: payload.email }, { identity: payload.identity }],
    });

    if (clientResult)
      throw new HttpException(
        'This client already exits',
        HttpStatus.BAD_REQUEST,
      );

    return await this.create(payload);
  }

  async updateAndVerified(uuid: string, payload: QueryDeepPartialEntity<Client>) {
    const client = await this.findOne({
      where: { uuid },
    } as FindManyOptions<Client>);

    if (!client) throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

    if (payload?.email && payload.email !== client.email) {
      const emailExists = await this.clientRepository.findOne({
        where: { email: payload.email as string },
      });

      if (emailExists) {
        throw new HttpException(
          'This email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (payload?.identity && payload.identity !== client.identity) {
      const identityExists = await this.clientRepository.findOne({
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

  async updateClientPhoto(file: BufferedFile, client: Client) {
    return await this.fileService.updateFile(client.photo.uuid, file);
  }
}
