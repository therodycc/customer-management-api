import { ApiProperty } from '@nestjs/swagger';
import { Base } from '@src/base/entities/base.entity';
import { Column } from 'typeorm';

export class AuthCodeBase extends Base {
  @ApiProperty({
    description: 'Código enviado al correo para validarlo',
  })
  @Column({ type: 'char', length: 6 })
  code: number;
}
