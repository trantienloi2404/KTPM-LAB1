import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Authentication Service API - NestJS Implementation';
  }
}
