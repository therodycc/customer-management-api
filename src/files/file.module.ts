import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioClientModule } from 'src/shared/minio-client/minio-client.module';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { FileMapper } from './mapper/file.mapper';
import { FileProfile } from './mapper/file.profile';

@Module({
  controllers: [FileController],
  providers: [FileRepository, FileService, FileProfile, FileMapper],
  imports: [TypeOrmModule.forFeature([File]), MinioClientModule],
  exports: [FileService],
})
export class FileModule {}
