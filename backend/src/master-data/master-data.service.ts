import { Inject, Injectable } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.provider';

@Injectable()
export class MasterDataService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async getRegions() {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM regions');
    return rows;
  }

  async getGoods() {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM goods');
    return rows;
  }

  async getEventTypes() {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM event_types');
    return rows;
  }
}
