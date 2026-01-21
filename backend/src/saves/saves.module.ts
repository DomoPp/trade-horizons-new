import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SavesController } from './saves.controller';
import { SavesService } from './saves.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SavesController],
  providers: [SavesService],
  exports: [SavesService],
})
export class SavesModule {}
