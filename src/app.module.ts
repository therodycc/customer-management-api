import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from "./address/address.module";
import { AuthModule } from './auth/auth.module';
import { ClientModule } from "./clients/client.module";
import { CustomConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FileModule } from './files/file.module';
import { SeedModule } from './seed/seed.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.getConfig();
        return config;
      },
    }),
    ScheduleModule.forRoot(),
    CustomConfigModule,
    UserModule,
    AuthModule,
    SeedModule,
    FileModule,
    SharedModule,
    ClientModule,
    AddressModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
