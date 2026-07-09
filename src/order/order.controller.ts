import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Controller('order')
export class OrderController {
  constructor(private ordersService: OrdersService) {}
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const orders = await this.ordersService.getOrderByOrderId(id);
    console.log(orders);
    return orders;
  }
}
