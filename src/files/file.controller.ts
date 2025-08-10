import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/common/decorators';
import { Buckets, Folders } from '@src/common/enums/buckets.enum';
import { Roles } from '@src/common/enums/roles.enum';
import { BufferedFile } from '@src/shared/minio-client/file.model';
import { FileService } from './file.service';

@Controller('files')
@Auth(Roles.User)
@ApiTags('Upload Files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    return await this.fileService.createFile(
      file,
      Buckets.AppFiles,
      Folders.Documents,
    );
  }
}
