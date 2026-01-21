import { Body, Controller, Post } from '@nestjs/common';
import { successResponse } from '../common/response';
import { TurnService } from './turn.service';

@Controller('turn')
export class TurnController {
  constructor(private readonly turnService: TurnService) {}

  @Post('next')
  async next(@Body('saveId') saveId: number) {
    const result = await this.turnService.nextTurn(Number(saveId));
    return successResponse(result);
  }
}
