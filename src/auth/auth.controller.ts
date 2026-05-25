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
import * as argon2 from 'argon2';
import * as _interface from './interface';
import { CreateUserDto } from './interface';
import { AuthService } from './auth.service';
import { Role } from '../common/decorators/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

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
      role: Role.User,
    };

    const token = this.authService.generateToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    return {
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.roles,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {}

  @Post('register')
  async register(
    @Body() dto: _interface.CreateUserDto,
  ): Promise<CreateUserDto | null> {
    dto.role = Role.User;
    dto.password = await argon2.hash(dto.password);

    return this.usersService.create(dto);
  }
}
