import { Global, Module } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { DB_POOL } from '../../src/config/database/database.constants';
import { DatabaseService } from '../../src/config/database/database.service';

@Global()
@Module({
  providers: [
    {
      provide: DB_POOL,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Pool> => {
        return createPool({
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          waitForConnections: true,
          connectionLimit: configService.get<number>('DB_CONNECTION_LIMIT'),
        });
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
