import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { MESSAGE } from '@src/shared/global/message';

@Injectable()
export class IdentityValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!this.isValidIdentity(value)) {
      throw new BadRequestException(MESSAGE.AUTH.INVALID_IDENTITY);
    }
    return value;
  }

  private isValidIdentity(identity: string): boolean {
    const identityRegex = /^[0-9]{11}$/;
    return identityRegex.test(identity);
  }
}
