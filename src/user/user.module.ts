import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '@src/files/file.module';
import { UserAdminController } from './controllers/admin/user.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { UserProfile } from './mapper/user.profile';
import { UserService } from './services/user.service';
import { UserRepository } from './user.repository';
import { SharedModule } from '@src/shared/shared.module';

@Module({
  controllers: [UserAdminController, UserController],
  exports: [UserService, UserRepository, UserMapper],
  providers: [UserProfile, UserService, UserRepository, UserMapper],
  imports: [TypeOrmModule.forFeature([User]), FileModule, SharedModule],
})
export class UserModule {}
