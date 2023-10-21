import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
