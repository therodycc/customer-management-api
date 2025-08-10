import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/base/base.service';
import { Address } from '../entities/address.entity';
import { AddressRepository } from '../repositories/address.repository';

@Injectable()
export class AddressService extends BaseService<Address> {
  constructor(private addressRepository: AddressRepository) {
    super(addressRepository);
  }
}
