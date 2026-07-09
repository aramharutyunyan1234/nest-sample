import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('orderStatus')
export class OrdersStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}

@Entity('ordersType')
export class OrdersType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Add this block to complete the ManyToMany bridge:
  @ManyToMany(() => Orders, (orders) => orders.types)
  orders: Orders[];
}

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  orderCreator: number | null;

  // 2. Added nullable: true to the relation options
  @ManyToOne(() => Users, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'orderCreator' })
  creators: Users | null;

  @Column()
  firstPrice: number;

  // 3. Made the primitive column nullable
  @Column({ nullable: true })
  orderWorker: number | null;

  // 4. Added nullable: true to the relation options
  @ManyToOne(() => Users, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'orderWorker' })
  workers: Users | null;

  @Column()
  lastPrice: number;

  @Column()
  materialPrice: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('int', { array: true, default: '{}' })
  types: number[];

  @Column()
  orderStatus: number;
  @ManyToOne(() => OrdersStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderStatus' })
  status: OrdersStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
