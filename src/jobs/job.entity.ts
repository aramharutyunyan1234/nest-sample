import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('jobs') // <--- Plural database table name
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: number;
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  user: Users;

  @Column()
  workerId: number;
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workerId' })
  user1: Users;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;
}
