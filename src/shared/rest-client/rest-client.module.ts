import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RestClientService } from './rest-client.service';

@Module({
  imports: [HttpModule],
  providers: [RestClientService],
  exports: [RestClientService],
})
export class RestClientModule {}
