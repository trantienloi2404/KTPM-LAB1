import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data', required: false })
  data?: T | null;

  constructor(statusCode: number, message: string, data?: T | null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
} 