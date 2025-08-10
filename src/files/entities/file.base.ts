import { AutoMap } from '@automapper/classes';
import { Base } from '@src/base/entities/base.entity';
import { Column } from 'typeorm';

export class FileBase extends Base {
  @Column('text', { unique: true })
  @AutoMap()
  url: string;

  @Column('text', { nullable: true })
  @AutoMap()
  name: string;

  @Column('text', { nullable: true })
  @AutoMap()
  fileName:string

  @Column('text', { nullable: true })
  @AutoMap()
  bucket: string;

  @Column('text', { nullable: true })
  @AutoMap()
  folder: string;

  // @Column('text')
  // @AutoMap()
  // label: string;
}
