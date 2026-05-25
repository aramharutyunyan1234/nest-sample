import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Fetch the required roles assigned via @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const cleanToken: string = authHeader.replace('Bearer ', '');
    const payload = this.authService.verifyToken(cleanToken);
    console.log(payload);
    console.log(requiredRoles);
    return requiredRoles.some((role) => payload?.role?.includes(role));
  }
}
