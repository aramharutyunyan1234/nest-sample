import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guard/auth.guard';
import { OrdersService } from './orders.service';
import * as interfaces from './interfaces';
import { GetUserId } from '../common/decorators/user.decorator';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('orderTypes')
  async orderTypesList() {
    const orderTypes = await this.ordersService.orderTypeListData();
    console.log(orderTypes);
    return orderTypes;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ) {
    const page = id | 0;

    const orders = await this.ordersService.getOrdersByUserId(
      userId,
      20,
      page * 20,
    );
    console.log(orders);
    return orders;
  }

  @Get('all/:id')
  async findAll(@Param('id', ParseIntPipe) id: number) {
    const page = id | 0;

    const orders = await this.ordersService.getOrders(20, page * 20);
    console.log(orders);
    return orders;
  }

  @Post()
  async save(
    @GetUserId() userId: number,
    @Body() OrdersRequestDto: interfaces.OrdersRequestDto,
  ) {
    OrdersRequestDto.orderCreator = userId;
    const orders = await this.ordersService.saveOrder(OrdersRequestDto);
    console.log(orders);
    return orders;
  }
}
