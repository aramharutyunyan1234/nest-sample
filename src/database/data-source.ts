import { DataSource } from 'typeorm';

import { Orders, OrdersType, OrdersStatus } from '../orders/orders.entity';

export const AppDataSource = new DataSource({
  type: 'postgres', // Change to 'mysql', 'mariadb', etc. if using another DB
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'user',
  database: 'postgrsql-nest',
  synchronize: false, // Keep false when using migrations
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'], // Path where your seed/migration files live
});
