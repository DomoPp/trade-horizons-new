import { Inject, Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.provider';

interface TradePlanInput {
  saveId: number;
  turn: number;
  regionId: number;
  items: Array<{ goodId: number; quantity: number }>;
}

@Injectable()
export class TradeService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async createPlan(input: TradePlanInput) {
    const values = input.items
      .filter((item) => item.quantity !== 0)
      .map((item) => [input.saveId, input.turn, input.regionId, item.goodId, item.quantity]);
    if (values.length === 0) {
      return { inserted: 0 };
    }
    const [result] = await this.pool.query<ResultSetHeader>(
      'INSERT INTO trade_plans (save_id, turn, region_id, good_id, quantity) VALUES ?'
      , [values]
    );
    return { inserted: result.affectedRows };
  }
}
