import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from '@src/base/base.service';
import { Buckets, Folders } from '@src/common/enums/buckets.enum';
import { BufferedFile } from '@src/shared/minio-client/file.model';
import { MinioClientService } from 'src/shared/minio-client/minio-client.service';
import { File } from './entities/file.entity';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    private fileRepository: FileRepository,
    private minioClientService: MinioClientService,
  ) {
    super(fileRepository);
  }

  async createFile(
    file: BufferedFile,
    bucketName: Buckets,
    folderName: Folders,
  ): Promise<File> {
    const result = await this.minioClientService.uploadFile(
      file,
      folderName,
      bucketName,
    );

    return await this.create({
      url: `${result.url}?name=${file.originalname}`,
      name: result.originalname,
      fileName: result.fileName,
      bucket: bucketName,
      folder: folderName,
    });
  }

  async updateFile(uuid: string, file: BufferedFile) {
    const _file = await this.findOne({
      where: {
        uuid,
      },
    });

    const filePath = `${_file.folder}/${_file.fileName}`;
    await this.minioClientService.update(filePath, file, Buckets.AppFiles);

    const [url, _query] = _file.url.split('?name');

    return await this.update(uuid, {
      name: file.originalname,
      url: `${url}?name=${file.originalname}`,
    });
  }

  async getFile(fileName: string, bucketName: string) {
    try {
      const fileStream = await this.minioClientService.getFile(
        fileName,
        bucketName,
      );
      return fileStream;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el archivo: ${error.message}`,
      );
    }
  }

  async deleteFile(uuid: string): Promise<void> {
    const file = await this.findOne({
      where: {
        uuid,
      },
    });

    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = `${file.folder}/${file.fileName}`;
    await this.minioClientService.delete(filePath, file.bucket);
    await this.remove(uuid);
  }
}
