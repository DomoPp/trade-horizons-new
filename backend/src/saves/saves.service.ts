import { Inject, Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.provider';

interface GameSave extends RowDataPacket {
  id: number;
  name: string;
  current_turn: number;
  region_id: number;
  money: number;
  created_at: string;
}

@Injectable()
export class SavesService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async createSave(name: string): Promise<GameSave> {
    const [regions] = await this.pool.query<RowDataPacket[]>('SELECT id FROM regions LIMIT 1');
    if (regions.length === 0) {
      throw new Error('No regions configured');
    }
    const regionId = regions[0].id as number;
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO game_saves (name, region_id) VALUES (?, ?)'
      , [name, regionId]
    );
    const saveId = result.insertId;
    const [goods] = await this.pool.query<RowDataPacket[]>('SELECT id FROM goods');
    if (goods.length > 0) {
      const values = goods.map((good) => [saveId, good.id, 0]);
      await this.pool.query('INSERT INTO player_inventory (save_id, good_id, quantity) VALUES ?', [values]);
    }
    return this.getSave(saveId);
  }

  async getSave(saveId: number): Promise<GameSave> {
    const [rows] = await this.pool.query<GameSave[]>('SELECT * FROM game_saves WHERE id = ?', [saveId]);
    if (rows.length === 0) {
      throw new Error('Save not found');
    }
    return rows[0];
  }
}
