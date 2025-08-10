import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressService } from '../services/address.service';
import { ClientService } from '@src/clients/services/client.service';

// @ApiCookieAuth()
// @Auth(Roles.User)
@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private clientService: ClientService,
  ) {}

  @Post('/client/:uuid')
  async create(
    @Param('uuid') clientUuid: string,
    @Body() payload: CreateAddressDto,
  ) {
    const client = await this.clientService.findOne({
      where: { uuid: clientUuid },
    });
    return this.addressService.create({
      ...payload,
      client,
    });
  }

  @Get('/client/:uuid')
  findAll(@Param('uuid') clientUuid: string) {
    return this.addressService.findAll({
      where: {
        client: {
          uuid: clientUuid,
        },
      },
    });
  }

  @Put('/:uuid')
  update(@Param('uuid') uuid: string, @Body() payload: UpdateAddressDto) {
    return this.addressService.update(uuid, payload);
  }

  @Delete('/:uuid')
  remove(@Param('uuid') uuid: string) {
    return this.addressService.remove(uuid);
  }
}
