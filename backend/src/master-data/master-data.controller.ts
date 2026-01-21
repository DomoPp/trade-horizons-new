import { Controller, Get } from '@nestjs/common';
import { successResponse } from '../common/response';
import { MasterDataService } from './master-data.service';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('regions')
  async regions() {
    return successResponse(await this.masterDataService.getRegions());
  }

  @Get('goods')
  async goods() {
    return successResponse(await this.masterDataService.getGoods());
  }

  @Get('event-types')
  async eventTypes() {
    return successResponse(await this.masterDataService.getEventTypes());
  }
}
