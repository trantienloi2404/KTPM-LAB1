import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // Simple SQLite database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'production' ? './data/notifications.db' : './notifications.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (development only)
    }),
    
    NotificationModule,
  ],
})
export class AppModule {} 