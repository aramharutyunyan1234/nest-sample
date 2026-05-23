// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

@Injectable()
export class AuthService {
  generateToken(userId: number, username: string): string {
    return jwt.sign({ sub: userId, username }, SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
