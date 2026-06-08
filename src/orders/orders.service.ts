import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/interface';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private readonly dataSource: DataSource,
  ) {}

  async getOrders(id: number = 0): Promise<Array<Orders> | null> {
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
                LEFT JOIN "orderStatus" os ON o."orderStatus" = os.id;`,
      [],
    );

    return orders || null;
  }

  async create(dto: CreateUserDto): Promise<CreateUserDto | null> {
    console.log(dto);
    const users = await this.dataSource.query(
      `INSERT INTO "users" (name, email, password, username, roles)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [dto.name, dto.email, dto.password, dto.userName, dto.role],
    );
    return users && users.length > 0 ? users[0] : null;
  }
}
