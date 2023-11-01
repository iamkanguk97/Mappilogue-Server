import { MarkCategoryService } from './../mark-category/services/mark-category.service';
import { ScheduleModule } from './../schedule/schedule.module';
import { Module } from '@nestjs/common';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkRepository } from './repositories/mark.repository';
import { MarkController } from './controllers/mark.controller';
import { MarkService } from './services/mark.service';
import { MarkHelper } from './helpers/mark.helper';
import { MarkCategoryRepository } from './repositories/mark-category.repository';

@Module({
  imports: [
    ScheduleModule,
    CustomRepositoryModule.forCustomRepository([
      MarkRepository,
      MarkCategoryRepository,
    ]),
  ],
  controllers: [MarkController],
  providers: [MarkService, MarkCategoryService, MarkHelper],
  exports: [MarkService, MarkHelper],
})
export class MarkModule {}
