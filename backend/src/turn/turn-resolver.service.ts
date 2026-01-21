import { Inject, Injectable } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.provider';
import { MarketService } from '../market/market.service';

interface SaveRow extends RowDataPacket {
  id: number;
  current_turn: number;
  region_id: number;
  money: number;
}

@Injectable()
export class TurnResolverService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
    private readonly marketService: MarketService,
  ) {}

  async resolveTurn(saveId: number) {
    const [saveRows] = await this.pool.query<SaveRow[]>('SELECT * FROM game_saves WHERE id = ?', [saveId]);
    if (saveRows.length === 0) {
      throw new Error('Save not found');
    }
    const save = saveRows[0];
    const turn = save.current_turn;
    const regionId = save.region_id;

    const marketState = await this.marketService.getMarketState(saveId, turn, regionId);

    const [plans] = await this.pool.query<RowDataPacket[]>(
      'SELECT * FROM trade_plans WHERE save_id = ? AND turn = ?'
      , [saveId, turn]
    );

    let money = Number(save.money);
    const transactions: Array<{ goodId: number; quantity: number; price: number }> = [];

    for (const plan of plans) {
      const priceEntry = marketState.prices.find((price) => price.goodId === plan.good_id);
      const price = priceEntry ? Number(priceEntry.price) : 0;
      const quantity = Number(plan.quantity);
      money -= price * quantity;
      transactions.push({ goodId: plan.good_id, quantity, price });

      await this.pool.query(
        'INSERT INTO transactions (save_id, turn, good_id, quantity, price) VALUES (?, ?, ?, ?, ?)'
        , [saveId, turn, plan.good_id, quantity, price]
      );

      await this.pool.query(
        'INSERT INTO player_inventory (save_id, good_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)'
        , [saveId, plan.good_id, quantity]
      );
    }

    const [eventRows] = await this.pool.query<RowDataPacket[]>('SELECT id FROM event_types');
    const event = eventRows.length > 0 ? eventRows[Math.floor(Math.random() * eventRows.length)] : null;
    if (event) {
      await this.pool.query(
        'INSERT INTO active_events (save_id, turn, event_type_id) VALUES (?, ?, ?)'
        , [saveId, turn, event.id]
      );
      await this.pool.query(
        'INSERT INTO incidents (save_id, turn, description, state) VALUES (?, ?, ?, ?)'
        , [saveId, turn, 'Random event triggered.', 'resolved']
      );
    }

    await this.pool.query('UPDATE game_saves SET money = ?, current_turn = current_turn + 1 WHERE id = ?', [money, saveId]);

    const summary = {
      turn,
      regionId,
      money,
      transactions,
      eventTriggered: event ? event.id : null,
    };

    await this.pool.query(
      'INSERT INTO turn_results (save_id, turn, summary) VALUES (?, ?, ?)'
      , [saveId, turn, JSON.stringify(summary)]
    );

    return summary;
  }
}
