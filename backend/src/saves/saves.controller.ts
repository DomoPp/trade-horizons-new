import { Body, Controller, Param, Post } from '@nestjs/common';
import { successResponse } from '../common/response';
import { SavesService } from './saves.service';

@Controller('saves')
export class SavesController {
  constructor(private readonly savesService: SavesService) {}

  @Post()
  async createSave(@Body('name') name = 'New Captain') {
    const save = await this.savesService.createSave(name);
    return successResponse(save);
  }

  @Post(':id/load')
  async loadSave(@Param('id') id: string) {
    const save = await this.savesService.getSave(Number(id));
    return successResponse(save);
  }
}
