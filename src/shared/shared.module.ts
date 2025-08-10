import { Module } from '@nestjs/common';
import { ExcelService } from './excel/excel.service';

const providers = [ExcelService];

@Module({
  providers,
  imports: [],
  exports: providers,
})
export class SharedModule {}
