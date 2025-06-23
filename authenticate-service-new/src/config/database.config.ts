// database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';

export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DATASOURCE_HOST || '',
    port: parseInt(process.env.DATASOURCE_PORT || '', 10),
    username: process.env.DATASOURCE_USERNAME || '',
    password: process.env.DATASOURCE_PASSWORD || '',
    database: process.env.DATASOURCE_DATABASE || '',
    entities: [User],
    synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  } as TypeOrmModuleOptions,
});
