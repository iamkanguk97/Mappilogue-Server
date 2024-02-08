import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { CustomRepositoryModule } from '../custom-repository/custom-repository.module';
import { UserAlarmHistoryRepository } from 'src/modules/api/user/repositories/user-alarm-history.repository';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UserAlarmHistoryRepository]),
    ScheduleModule.forRoot(),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
