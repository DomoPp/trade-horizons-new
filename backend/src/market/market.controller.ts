import { Controller, Get, Query } from '@nestjs/common';
import { successResponse } from '../common/response';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('state')
  async state(
    @Query('saveId') saveId: string,
    @Query('turn') turn: string,
    @Query('regionId') regionId: string
  ) {
    const data = await this.marketService.getMarketState(Number(saveId), Number(turn), Number(regionId));
    return successResponse(data);
  }
}
