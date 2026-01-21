import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MarketModule } from '../market/market.module';
import { TurnController } from './turn.controller';
import { TurnService } from './turn.service';
import { TurnResolverService } from './turn-resolver.service';

@Module({
  imports: [DatabaseModule, MarketModule],
  controllers: [TurnController],
  providers: [TurnService, TurnResolverService],
})
export class TurnModule {}
