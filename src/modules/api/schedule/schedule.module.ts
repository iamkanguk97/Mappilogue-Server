import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { ScheduleRepository } from './repositories/schedule.repository';
import { ScheduleAreaRepotory } from './repositories/schedule-area.repository';
import { NotificationModule } from 'src/modules/core/notification/notification.module';
import { UserModule } from '../user/user.module';
import { UserAlarmHistoryRepository } from '../user/repositories/user-alarm-history.repository';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    CustomRepositoryModule.forCustomRepository([
      ScheduleRepository,
      ScheduleAreaRepotory,
      UserAlarmHistoryRepository,
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
