import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientService } from '../services/client.service';

@ApiCookieAuth()
// @Auth(Roles.User)
@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() payload: CreateClientDto) {
    return this.clientService.create(payload);
  }

  @Get('/')
  findAll() {
    return this.clientService.findAll({ relations: { addresses: true } });
  }

  @Put('/:uuid')
  update(@Param('uuid') uuid: string, @Body() payload: UpdateClientDto) {
    return this.clientService.update(uuid, payload);
  }

  @Delete('/:uuid')
  remove(@Param('uuid') uuid: string) {
    return this.clientService.remove(uuid);
  }
}
