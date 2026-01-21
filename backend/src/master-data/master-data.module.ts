import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
