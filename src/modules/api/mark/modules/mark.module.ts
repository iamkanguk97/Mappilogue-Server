import { ScheduleModule } from '../../schedule/schedule.module';
import { Module } from '@nestjs/common';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkController } from '../controllers/mark.controller';
import { MarkService } from '../services/mark.service';
import { MarkHelper } from '../helpers/mark.helper';
import { MarkCategoryRepository } from '../repositories/mark-category.repository';
import { MarkCategoryModule } from './mark-category.module';
import { MarkMetadataRepository } from '../repositories/mark-metadata.repository';
import { MarkLocationRepository } from '../repositories/mark-location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkEntity } from '../entities/mark.entity';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { ScheduleAreaRepository } from '../../schedule/repositories/schedule-area.repository';

@Module({
  imports: [
    MarkCategoryModule,
    ScheduleModule,
    TypeOrmModule.forFeature([
      MarkEntity,
      MarkCategoryEntity,
      MarkMetadataEntity,
      MarkLocationEntity,
    ]),
    CustomRepositoryModule.forCustomRepository([
      MarkRepository,
      MarkCategoryRepository,
      MarkMetadataRepository,
      MarkLocationRepository,
      ScheduleAreaRepository,
    ]),
  ],
  controllers: [MarkController],
  providers: [MarkService, MarkHelper],
  exports: [MarkService, MarkHelper],
})
export class MarkModule {}
