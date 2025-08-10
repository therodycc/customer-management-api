import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../enums/roles.enum';
import { UserRoleGuard } from '@src/auth/guards/user-role/user-role.guard';
import { RoleProtected } from '.';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
