import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guard/auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
  async findAll(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    const orders = await this.ordersService.getOrders(id);
    console.log(orders);
    return orders;
  }
}
