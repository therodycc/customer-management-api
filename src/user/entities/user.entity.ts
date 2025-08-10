import { ApiProperty } from '@nestjs/swagger';
import { AuthCode } from '@src/auth/entities/auth-codes.entity';
import { SSOSession } from '@src/auth/entities/session.entity';

import { File } from '@src/files/entities/file.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserBase } from './user.base';

@Entity({ name: 'users' })
export class User extends UserBase {
  @ApiProperty({
    description: 'Sesiones de inicio de sesión único (SSO) del usuario',
  })
  @OneToMany(() => SSOSession, (x) => x.user)
  SSOSessions: SSOSession[];

  @ApiProperty({
    description: 'Códigos de inicio de sesión para validación de los correos',
  })
  @OneToMany(() => AuthCode, (x) => x.user)
  authCodes: AuthCode[];

  @OneToOne(() => File, { nullable: true })
  @JoinColumn()
  photo: File;
}
