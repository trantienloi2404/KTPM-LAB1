import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'User ID to send notification to' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ 
    description: 'Priority level', 
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  })
  @IsOptional()
  @IsIn(['low', 'normal', 'high'])
  priority?: 'low' | 'normal' | 'high' = 'normal';

  @ApiPropertyOptional({ description: 'Additional data' })
  @IsOptional()
  data?: any;
} 