import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DB_POOL } from './database.module';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DB_POOL) private readonly pool: Pool,
  ) {}

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    await this.pool.execute(sql, params);
  }
}
