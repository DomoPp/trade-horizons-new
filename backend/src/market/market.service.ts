import { Inject, Injectable } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.provider';

@Injectable()
export class MarketService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async getMarketState(saveId: number, turn: number, regionId: number) {
    const [prices] = await this.pool.query<RowDataPacket[]>(
      'SELECT mp.good_id, mp.price, g.name FROM market_prices mp JOIN goods g ON g.id = mp.good_id WHERE mp.turn = ? AND mp.region_id = ?'
      , [turn, regionId]
    );
    if (prices.length === 0) {
      const [goods] = await this.pool.query<RowDataPacket[]>('SELECT id, base_price, name FROM goods');
      const generated = goods.map((good) => {
        const multiplier = 0.8 + Math.random() * 0.4;
        const price = Number((Number(good.base_price) * multiplier).toFixed(2));
        return { goodId: good.id as number, price, name: good.name as string };
      });
      const values = generated.map((entry) => [turn, regionId, entry.goodId, entry.price]);
      if (values.length > 0) {
        await this.pool.query(
          'INSERT INTO market_prices (turn, region_id, good_id, price) VALUES ?'
          , [values]
        );
      }
      return {
        saveId,
        turn,
        regionId,
        prices: generated,
      };
    }
    return {
      saveId,
      turn,
      regionId,
      prices: prices.map((row) => ({
        goodId: row.good_id,
        price: Number(row.price),
        name: row.name,
      })),
    };
  }
}
