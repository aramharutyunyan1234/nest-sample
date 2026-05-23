import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import * as _interface from './interface';
import { CreateUserDto } from './interface';

@Controller('auth')
export class AuthController {
  private readonly jwtSecret = 'YOUR_SUPER_SECRET_KEY';
  private readonly refreshSecret = 'YOUR_REFRESH_SECRET';

  constructor(private usersService: UsersService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: { userName: string; password: string },
  ): Promise<_interface.LoginResponse> {
    const user = await this.usersService.getUserWithAuth(loginDto.userName);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await argon2.verify(user.password, loginDto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: user.id }, this.refreshSecret, {
      expiresIn: '7d',
    });

    return {
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {}

  @Post('register')
  async register(
    @Body() dto: _interface.CreateUserDto,
  ): Promise<CreateUserDto | null> {
    return this.usersService.create(dto);
  }
}
