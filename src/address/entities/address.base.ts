import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/base/entities/base.entity';
import { Column } from 'typeorm';

export class AddressBase extends Base {
  @ApiProperty({
    example: 'Casa',
    description: 'El lugar que pertenece a esa dirección',
  })
  @Column('text')
  name: string;

  @ApiProperty({
    example: 'Cerca del comercial',
    description: 'Referencias adicionales',
  })
  @Column('text', { nullable: true })
  references: string;

  @ApiProperty({
    example: 'C/ la prueba. Sector',
    description: 'Dirección completa',
  })
  @Column('text')
  address: string;

  @ApiProperty({
    example: 'Santo Domingo',
    description: 'Provincia',
  })
  @Column('text')
  province: string;

  @ApiProperty({
    example: 18.456789,
    description: 'Latitud',
    nullable: true,
  })
  @Column('float', {
    nullable: true,
  })
  lat: number;

  @ApiProperty({
    example: -69.987654,
    description: 'Longitud',
    nullable: true,
  })
  @Column('float', {
    nullable: true,
  })
  long: number;

  @ApiProperty({
    example: true,
    description: 'Principal',
  })
  @Column('boolean', {
    nullable: true,
    default: false,
  })
  isMain: boolean;
}
