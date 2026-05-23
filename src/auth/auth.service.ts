// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWTPayload } from './interface';

// const SECRET = process.env.JWT_SECRET || 'your-secret-key';
@Injectable()
export class AuthService {
  private readonly jwtSecret = 'YOUR_SUPER_SECRET_KEY';
  private readonly refreshSecret = 'YOUR_REFRESH_SECRET';
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }
  generateRefreshToken(payload: JWTPayload): string {
    // return jwt.sign({ sub: userId, username }, this.jwtSecret, { expiresIn: '7d' });
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
