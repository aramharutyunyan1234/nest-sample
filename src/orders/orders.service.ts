import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Orders, OrdersType } from './orders.entity';
import { CreateOrdersDto, OrdersRequestDto } from './interfaces';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private readonly dataSource: DataSource,
  ) {}

  async getOrders(limit: number = 20, offset: number = 0): Promise<Array<Orders> | null> {
    const orders: Array<Orders> = await this.dataSource.query(
      `SELECT
           o.*,
           u.name AS creatorName,
           u.id AS creatorId,
           u1.name AS workerName,
           u1.id AS workerId,
           os.name AS orderStatusName,
           (
               SELECT string_agg(ot.name, ', ')
               FROM "ordersType" ot
               WHERE ot.id = ANY(o.types)
           ) AS orderTypeNames
      FROM orders o
                LEFT JOIN users u ON u.id = o."orderCreator"
                LEFT JOIN users u1 ON u1.id = o."orderWorker"
                LEFT JOIN "orderStatus" os ON o."orderStatus" = os.id
      ORDER BY id
      LIMIT $1 OFFSET $2;`,
      [limit, offset],
    );

    return orders || null;
  }

  async getOrdersByUserId(id: number, limit: number = 20, offset: number = 0): Promise<Array<Orders> | null> {
    const orders: Array<Orders> = await this.dataSource.query(
      `SELECT
           o.*,
           u.name AS creatorName,
           u.id AS creatorId,
           u1.name AS workerName,
           u1.id AS workerId,
           os.name AS orderStatusName,
           (
               SELECT string_agg(ot.name, ', ')
               FROM "ordersType" ot
               WHERE ot.id = ANY(o.types)
           ) AS orderTypeNames
       FROM orders o
                LEFT JOIN users u ON u.id = o."orderCreator"
                LEFT JOIN users u1 ON u1.id = o."orderWorker"
                LEFT JOIN "orderStatus" os ON o."orderStatus" = os.id
       WHERE o."orderCreator" = $1 OR o."orderWorker" = $1
       ORDER BY id
       LIMIT $2
       OFFSET $3;`,
      [id, limit, offset],
    );

    return orders || null;
  }

  async saveOrder(data: Partial<OrdersRequestDto>): Promise<Array<Orders> | null> {
    const orders: Array<Orders> = await this.dataSource.query(
      `INSERT INTO orders (
          "orderCreator",
          "firstPrice",
          "orderWorker",
          "lastPrice",
          "materialPrice",
          "title",
          "description",
          "types",
          "orderStatus",
          "created_at"
      )
       VALUES ($1,$2,$3,$4,$5,$6, $7, $8, $9, NOW())
       RETURNING *;`,
      [
        data.orderCreator,
        data.price,
        data.orderCreator,
        0,
        0,
        data.titleName,
        data.descriptions,
        data.types,
        1,
      ],
    );

    return orders || null;
  }

  async orderTypeListData(): Promise<Array<OrdersType> | null> {
    const orderTypes: Array<OrdersType> = await this.dataSource.query(
      `SELECT * FROM "ordersType"`,
      [],
    );

    return orderTypes;
  }

  async getOrderByOrderId(id: number): Promise<Orders | null> {
    const orders: Orders = await this.dataSource.query(
      `SELECT
           o.*,
           u.name AS "creatorName",
           u.id AS "creatorId",
           u1.name AS "workerName",
           u1.id AS "workerId",
           os.name AS "orderStatusName",
           (
               SELECT string_agg(ot.name, ', ')
               FROM "ordersType" ot
               WHERE ot.id = ANY(o.types)
           ) AS "orderTypeNames",
           (
               SELECT string_agg(f."fileAddress", ', ')
               FROM "files" f
               WHERE f."orderId" = o.id AND f."userId" = o."orderCreator"
           ) AS "creatorImages",
           (
               SELECT string_agg(f1."fileAddress", ', ')
               FROM "files" f1
               WHERE f1."orderId" = o.id AND f1."userId" = o."orderWorker"
           ) AS "workerImages"
       FROM orders o
                LEFT JOIN users u
                          ON u.id = o."orderCreator"
                LEFT JOIN users u1
                          ON u1.id = o."orderWorker"
                LEFT JOIN "orderStatus" os
                          ON o."orderStatus" = os.id
       WHERE o.id = $1;`,
      [id],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return orders ? orders[0] : null;
  }
}
