import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  userId: string; // ID của user nhận notification

  @Column({ default: 'normal' })
  priority: 'low' | 'normal' | 'high';

  @Column('simple-json', { nullable: true })
  data: any; // Extra data nếu cần

  @Column({ nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
} 