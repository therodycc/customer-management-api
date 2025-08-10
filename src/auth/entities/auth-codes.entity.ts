import { User } from '@src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AuthCodeBase } from './auth-codes.base';

@Entity({ name: 'auth_codes' })
export class AuthCode extends AuthCodeBase {
  @ManyToOne(() => User, (x) => x.authCodes)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
