import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SavesModule } from './saves/saves.module';
import { MasterDataModule } from './master-data/master-data.module';
import { MarketModule } from './market/market.module';
import { TradeModule } from './trade/trade.module';
import { TurnModule } from './turn/turn.module';

@Module({
  imports: [
    DatabaseModule,
    SavesModule,
    MasterDataModule,
    MarketModule,
    TradeModule,
    TurnModule,
  ],
})
export class AppModule {}
