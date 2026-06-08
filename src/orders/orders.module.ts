import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders, OrdersStatus, OrdersType } from './orders.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([OrdersStatus, OrdersType, Orders]),
    AuthModule,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
