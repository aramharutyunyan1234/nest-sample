import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, CreateDateColumn, ManyToMany, JoinTable,
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
}

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderCreator: number;
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderCreator' })
  creators: Users;

  @Column()
  firstPrise: number;

  @Column()
  orderWorker: number;
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderWorker' })
  workers: Users;

  @Column()
  lastPrise: number;

  @Column()
  materialPrice: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('int', { array: true, nullable: true })
  @ManyToMany(() => OrdersType, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'entity_orders_types', // Name of the junction table that TypeORM will create
    joinColumn: { name: 'entityId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ordersTypeId', referencedColumnName: 'id' },
  })
  types: OrdersType[];

  @Column()
  orderStatus: number;
  @ManyToOne(() => OrdersStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderStatus' })
  status: OrdersStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
