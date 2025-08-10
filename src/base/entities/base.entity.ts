import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base extends BaseEntity {
  @ApiProperty({
    description: 'Identificador único',
    readOnly: true,
  })
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ type: 'int8' })
  @AutoMap()
  id: number;

  @ApiProperty({ description: 'UUID generado automáticamente', readOnly: true })
  @Column('uuid', { unique: true })
  @Generated('uuid')
  @AutoMap()
  uuid: string;

  @ApiProperty({ example: 1, description: 'Usuario que creó el registro' })
  @Column({ type: 'varchar', nullable: true })
  @AutoMap()
  createdBy: string;

  @ApiProperty({
    description: 'Fecha y hora en que se eliminó el registro',
    readOnly: true,
  })
  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  @AutoMap()
  deletedAt: Date;

  @ApiProperty({
    description: 'Fecha y hora en que se creó el registro',
    readOnly: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  @AutoMap()
  createdAt: Date;

  @ApiProperty({ example: 2, description: 'Usuario que modificó el registro' })
  @Column({ type: 'varchar', nullable: true })
  @AutoMap()
  modifiedBy: string;

  @ApiProperty({
    description: 'Fecha y hora de la última modificación del registro',
    readOnly: true,
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  @Column({ type: 'timestamp', nullable: true })
  @AutoMap()
  modifiedAt: Date;

  // setAuditFields(userId: string, isNew = false) {
  //   const now = new Date();
  //   this.modifiedBy = userId;
  //   this.modifiedAt = now;
  //   if (isNew) {
  //     this.createdBy = userId;
  //     this.createdAt = now;
  //   }
  // }

  toJSON() {
    return instanceToPlain(this);
  }
}
