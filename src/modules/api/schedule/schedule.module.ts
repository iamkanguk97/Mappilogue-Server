import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { ScheduleRepository } from './repositories/schedule.repository';
import { UserAlarmHistoryRepository } from '../user/repositories/user-alarm-history.repository';
import { ScheduleHelper } from './helpers/schedule.helper';
import { ScheduleAreaRepository } from './repositories/schedule-area.repository';
import { ScheduleValidationPipe } from './pipes/schedule-validation.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './entities/schedule.entity';
import { ScheduleAreaEntity } from './entities/schedule-area.entity';
import { UserProfileModule } from '../user/modules/user-profile.module';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [
    UserProfileModule,
    TypeOrmModule.forFeature([ScheduleEntity, ScheduleAreaEntity]),
    CustomRepositoryModule.forCustomRepository([
      ScheduleRepository,
      ScheduleAreaRepository,
      UserAlarmHistoryRepository,
      UserRepository,
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleHelper, ScheduleValidationPipe],
  exports: [ScheduleService, ScheduleHelper, ScheduleValidationPipe],
})
export class ScheduleModule {}
