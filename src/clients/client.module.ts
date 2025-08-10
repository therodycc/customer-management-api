import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '@src/files/file.module';
import { SharedModule } from '@src/shared/shared.module';
import { ClientRepository } from './client.repository';
import { ClientController } from './controllers/client.controller';
import { Client } from './entities/client.entity';
import { ClientService } from './services/client.service';

@Module({
  controllers: [ClientController],
  exports: [ClientService, ClientRepository],
  providers: [ClientService, ClientRepository],
  imports: [TypeOrmModule.forFeature([Client]), FileModule, SharedModule],
})
export class ClientModule {}
