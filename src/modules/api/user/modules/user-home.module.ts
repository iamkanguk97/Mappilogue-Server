import { Module } from '@nestjs/common';
import { UserHomeService } from '../services/user-home.service';
import { UserHomeController } from '../controllers/user-home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { MarkRepository } from '../../mark/repositories/mark.repository';
import { ScheduleRepository } from '../../schedule/repositories/schedule.repository';
import { ScheduleAreaRepository } from '../../schedule/repositories/schedule-area.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnouncementEntity]),
    CustomRepositoryModule.forCustomRepository([
      AnnouncementRepository,
      MarkRepository,
      ScheduleRepository,
      ScheduleAreaRepository,
    ]),
  ],
  controllers: [UserHomeController],
  providers: [UserHomeService],
  exports: [UserHomeService],
})
export class UserHomeModule {}
