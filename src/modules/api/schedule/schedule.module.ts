import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { ScheduleRepository } from './repositories/schedule.repository';

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([ScheduleRepository])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
