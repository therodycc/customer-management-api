import { Injectable } from '@nestjs/common';
import { Gender } from '@src/common/enums/gender.enum';
import { Roles } from '@src/common/enums/roles.enum';
import { ConfigService } from '@src/config/config.service';
import { MESSAGE } from '@src/shared/global/message';
import { UserService } from '@src/user/services/user.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async saveDbSeed() {
    const dbHasData = await this.userService.findAll();
    if (dbHasData.length)
      return { message: MESSAGE.SEED.DATABASE_ALREADY_HAS_DATA };

    await this.userService.create({
      completeName: 'Admin',
      identity: '001-1234567-8',
      email: 'admin@gmail.com',
      phoneNumber: '+18095551234',
      gender: Gender.Male,
      password: '1234!',
      active: true,
      lastActivity: new Date('2025-06-25T10:00:00Z'),
      birthDate: new Date('1990-04-15'),
      role: Roles.Admin,
    });

    return { message: MESSAGE.SEED.SEED_EXECUTED };
  }
}
