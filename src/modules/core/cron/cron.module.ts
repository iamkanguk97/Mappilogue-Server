import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './services/cron.service';
import { UserRepository } from 'src/modules/api/user/repositories/user.repository';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UserRepository]),
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class CronModule {}
