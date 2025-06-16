import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async create(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  async findAll() {
    return await this.notificationService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for a specific user' })
  async findByUser(@Param('userId') userId: string) {
    return await this.notificationService.findByUser(userId);
  }

  @Get('user/:userId/unread')
  @ApiOperation({ summary: 'Get unread notifications for a user' })
  async findUnreadByUser(@Param('userId') userId: string) {
    return await this.notificationService.findUnreadByUser(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  async markAllAsReadForUser(@Param('userId') userId: string) {
    await this.notificationService.markAllAsReadForUser(userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  async remove(@Param('id') id: string) {
    await this.notificationService.remove(id);
    return { message: 'Notification deleted successfully' };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  async getStats() {
    return await this.notificationService.getStats();
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get notification statistics for a user' })
  async getStatsForUser(@Param('userId') userId: string) {
    return await this.notificationService.getStats(userId);
  }
} 