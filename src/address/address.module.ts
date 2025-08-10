import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { AddressController } from './controllers/addres.controller';
import { Address } from './entities/address.entity';
import { AddressRepository } from './repositories/address.repository';
import { AddressService } from './services/address.service';
import { ClientModule } from "@src/clients/client.module";

const providers = [AddressService, AddressRepository];
@Module({
  controllers: [AddressController],
  providers,
  imports: [TypeOrmModule.forFeature([Address]), AuthModule, ClientModule],
  exports: providers,
})
export class AddressModule {}
