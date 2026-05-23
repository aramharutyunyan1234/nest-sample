import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // 👈 Path to your users module

@Module({
  imports: [
    UsersModule, // 👈 Gives AuthController/Service access to UsersService
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
