import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SSOSessionBase } from './session.base';
import { User } from '@src/user/entities/user.entity';

@Entity({ name: 'user_sessions' })
export class SSOSession extends SSOSessionBase {
  @ManyToOne(() => User, (x) => x.SSOSessions)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
