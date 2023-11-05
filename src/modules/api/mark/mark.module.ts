import { MarkCategoryService } from './../mark-category/services/mark-category.service';
import { ScheduleModule } from './../schedule/schedule.module';
import { Module } from '@nestjs/common';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkRepository } from './repositories/mark.repository';
import { MarkController } from './controllers/mark.controller';
import { MarkService } from './services/mark.service';
import { MarkHelper } from './helpers/mark.helper';
import { MarkCategoryRepository } from './repositories/mark-category.repository';
import { MarkCategoryModule } from '../mark-category/mark-category.module';
import { MarkMetadataRepository } from './repositories/mark-metadata.repository';

@Module({
  imports: [
    ScheduleModule,
    MarkCategoryModule,
    CustomRepositoryModule.forCustomRepository([
      MarkRepository,
      MarkCategoryRepository,
      MarkMetadataRepository,
    ]),
  ],
  controllers: [MarkController],
  providers: [MarkService, MarkHelper, MarkCategoryService],
  exports: [MarkService, MarkHelper],
})
export class MarkModule {}
