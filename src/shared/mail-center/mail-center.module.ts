import { Module } from '@nestjs/common';
import { RestClientModule } from '../rest-client/rest-client.module';
import { MailCenterService } from './mail-center.service';

@Module({
  providers: [MailCenterService],
  controllers: [],
  imports: [RestClientModule],
  exports: [MailCenterService, RestClientModule],
})
export class MailCenterModule {}
