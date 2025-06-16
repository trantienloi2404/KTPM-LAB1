import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // Tạo notification mới
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(dto);
    return await this.notificationRepository.save(notification);
  }

  // Lấy tất cả notifications
  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy notifications của một user
  async findByUser(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy chỉ notifications chưa đọc của user
  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  // Đánh dấu đã đọc
  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id }
    });
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    
    return await this.notificationRepository.save(notification);
  }

  // Đánh dấu tất cả notifications của user đã đọc
  async markAllAsReadForUser(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  // Xóa notification
  async remove(id: string): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  // Thống kê đơn giản
  async getStats(userId?: string) {
    const where = userId ? { userId } : {};
    
    const total = await this.notificationRepository.count({ where });
    const unread = await this.notificationRepository.count({ 
      where: { ...where, isRead: false } 
    });
    
    return {
      total,
      unread,
      read: total - unread,
    };
  }
} 