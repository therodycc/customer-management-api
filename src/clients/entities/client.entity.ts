
import { File } from '@src/files/entities/file.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ClientBase } from './client.base';
import { Address } from "@src/address/entities/address.entity";

@Entity({ name: 'clients' })
export class Client extends ClientBase {
  @OneToOne(() => File, { nullable: true })
  @JoinColumn()
  photo: File;

  @OneToMany(() => Address, address => address.client, { cascade: true })
  addresses: Address[];
}
