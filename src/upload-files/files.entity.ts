import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  userId: number;

  @Column()
  fileAddress: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
