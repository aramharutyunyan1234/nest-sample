import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }
    const cleanToken: string = authHeader.replace('Bearer ', '');
    const payload = this.authService.verifyToken(cleanToken);
    request['user'] = payload;
    return !!payload;
  }
}
