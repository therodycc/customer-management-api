import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '@src/common/decorators/role-protected.decorator';
import { User } from '@src/user/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    const isAnAuthRoute = req?.originalUrl.includes('/auth');

    if (!user) throw new BadRequestException('User not found');

    if (!user.isValid && !isAnAuthRoute)
      throw new UnauthorizedException('You need to validate your email');

    if (validRoles.includes(user.role)) return true;

    throw new ForbiddenException(`User ${user.completeName} need a valid role`);
  }
}
