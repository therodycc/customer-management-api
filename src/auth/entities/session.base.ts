import { Base } from 'src/base/entities/base.entity';
import { Column } from 'typeorm';

// TODO: ASK ABOUT HOW THIS IS MANAGED IN THE OTHER PROJECTS
export class SSOSessionBase extends Base {
  @Column('text')
  userAgent: string;

  @Column('text')
  token: string;

  @Column('text')
  referer: string;

  @Column('text')
  ip: string;
}
