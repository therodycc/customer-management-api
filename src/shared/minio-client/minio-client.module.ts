import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get('MINIO_ENDPOINT'),
        port: parseInt(configService.get('MINIO_PORT')),
        useSSL: false,
        accessKey: configService.get('MINIO_ROOT_USER'),
        secretKey: configService.get('MINIO_ROOT_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
