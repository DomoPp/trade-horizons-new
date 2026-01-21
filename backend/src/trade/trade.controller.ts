import { Body, Controller, Post } from '@nestjs/common';
import { successResponse } from '../common/response';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('plan')
  async plan(@Body() body: { saveId: number; turn: number; regionId: number; items: Array<{ goodId: number; quantity: number }> }) {
    const result = await this.tradeService.createPlan(body);
    return successResponse(result);
  }
}
