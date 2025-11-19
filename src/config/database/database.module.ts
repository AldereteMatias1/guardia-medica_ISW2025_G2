import { Global, Module } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service';
import { DB_POOL } from './database.constants';

@Global()
@Module({
  providers: [
    {
      provide: DB_POOL,
      useFactory: async (): Promise<Pool> => {
        return createPool({
          host: 'localhost',
          port: 3306,
          user: 'admin',
          password: 'admin',
          database: 'clinica_db', 
          waitForConnections: true,
          connectionLimit: 10,
        });
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
