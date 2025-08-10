import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import {
  BufferedFile,
  AppMimeTypes,
  MinIOFile,
  MetaData,
  AppMimeType,
} from './file.model';
import * as crypto from 'crypto';
import { Folders, Buckets } from '@src/common/enums/buckets.enum';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioService');
  }

  public get client() {
    return this.minio.client;
  }

  public async uploadFile(
    file: BufferedFile,
    folderName: Folders,
    bucketName: Buckets,
    objectLocking: boolean = false,
  ): Promise<MinIOFile> {
    if (!file) {
      throw new HttpException(
        `El archivo ${file?.originalname} no es un archivo válido, se define como ${typeof file}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!AppMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        `El archivo ${file?.originalname} no es un archivo de formato soportado`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._createBucket(bucketName, objectLocking);

    const timestamp = Date.now().toString();

    const hashedFileName = crypto
      .createHash('sha1')
      .update(timestamp + Math.random().toString() + file?.originalname)
      .digest('hex');

    const extension = file?.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const originalName = file?.originalname.slice(
      0,
      file.originalname.lastIndexOf('.'),
    );

    const fileName = hashedFileName + extension;
    const filePath = `${folderName}/${fileName}`;

    try {
      await this.client.putObject(
        bucketName,
        filePath,
        file.buffer,
        file.size,
        this.getMetaData(file),
      );
      return {
        url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${filePath}`,
        originalname: originalName + extension,
        fileName,
      };
    } catch (err) {
      throw new HttpException(
        `Error subiendo el archivo ${file.originalname} en el folder ${folderName} -> ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getFile(
    filePath: string,
    bucketName: string,
  ): Promise<[metadata: MetaData, stream: NodeJS.ReadableStream]> {
    const metadata: MetaData = await this.getFileMetadata(
      filePath,
      bucketName,
    );
    const stream: NodeJS.ReadableStream = await this.getFileStream(
      filePath,
      bucketName,
    );
    return [metadata, stream];
  }

  private async getFileStream(
    objectName: string,
    bucketName: string,
  ): Promise<NodeJS.ReadableStream> {
    try {
      return await this.client.getObject(bucketName, objectName);
    } catch (err) {
      throw new HttpException(
        'Error obteniendo el archivo -> ' + err.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getFileMetadata(
    objectName: string,
    bucketName: string,
  ): Promise<MetaData> {
    try {
      const metadata = await this.client.statObject(bucketName, objectName);
      const metaData: MetaData = {
        contentType: metadata.metaData['content-type'],
        contentLength: metadata.size,
        contentTransferEnconding:
          metadata.metaData['content-transfer-encoding'],
        contentDisposition: metadata.metaData['content-disposition'],
      };
      return metaData;
    } catch (err) {
      throw new HttpException(
        'Error obteniendo la metadata del archivo -> ' + err.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getMetaData(file: BufferedFile) {
    return {
      'Content-Type': file.mimetype as AppMimeType,
      'Content-Length': file.size,
      'Content-Transfer-Encoding': 'binary',
      'Content-Disposition': 'inline; filename=' + file.originalname, // Cambiado a inline
    };
  }

  async update(
    filePath: string,
    file: BufferedFile,
    bucketName: string,
  ): Promise<boolean> {
    try {
      await this.client.putObject(
        bucketName,
        filePath,
        file.buffer,
        file.size,
        this.getMetaData(file),
      );
      return true;
    } catch (err) {
      throw new HttpException(
        `Error actualizando el archivo ${filePath} -> ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(filePath: string, bucketName: string): Promise<void> {
    try {
      await this.client.removeObject(bucketName, filePath);
    } catch (err) {
      throw new HttpException(
        'Hubo un error eliminando el archivo -> ' + err.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async _createBucket(
    bucketName: string,
    objectLocking: boolean,
  ): Promise<void> {
    const bucketExists = await this.client.bucketExists(bucketName);
    if (!bucketExists) {
      await this.client.makeBucket(bucketName, 'us-east-1', {
        ObjectLocking: objectLocking,
      });
      if (objectLocking) {
        await this.client.setObjectLockConfig(bucketName);
      }
    }
  }
}
