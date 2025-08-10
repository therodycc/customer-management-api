import { Entity, ManyToOne } from 'typeorm';
import { AddressBase } from './address.base';
import { Client } from "@src/clients/entities/client.entity";

@Entity({ name: 'addresses' })
export class Address extends AddressBase {
  @ManyToOne(() => Client, customer => customer.addresses, { onDelete: 'CASCADE' })
  client: Client;
}
