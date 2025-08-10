import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@src/common/enums/gender.enum';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Base } from 'src/base/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export class ClientBase extends Base {
  @ApiProperty({
    example: 'JOHN DOE DAVIS',
    description: 'Nombre completo',
  })
  @Column('text', { nullable: true })
  @AutoMap()
  completeName: string;

  @ApiProperty({
    example: '40200000000',
    description: 'Número de identificación dominicano',
  })
  @Column('text', { unique: true, nullable: true })
  @AutoMap()
  identity: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Dirección de correo electrónico del usuario',
  })
  @Column('text')
  @AutoMap()
  email: string;

  @ApiProperty({
    example: '1809000000',
    description: 'Número de teléfono del usuario',
  })
  @Column('text', { nullable: true })
  @AutoMap()
  phoneNumber: string;

  @ApiProperty({
    example: 'TestPassword_1234',
    description:
      'Mínimo (8) && máximo (50). Debe incluir ( Mayúsculas | Números | Letras | Símbolos )',
  })
  @Exclude({ toPlainOnly: false })
  @Column('text', {default:"TEst_234234"})
  password: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00Z',
    description: 'Fecha de nacimiento del usuario',
  })
  @Column({ type: 'timestamp', nullable: true })
  @AutoMap()
  birthDate: Date;

  @ApiProperty({
    example: Gender.Male,
    description: 'Género del usuario',
  })
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
  })
  @AutoMap()
  gender: Gender;

  genderTranslated: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPasswordUpdated() {
    if (!this.password) return;
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
