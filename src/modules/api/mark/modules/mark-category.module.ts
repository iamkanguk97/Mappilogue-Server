import { MarkRepository } from '../repositories/mark.repository';
import { Module } from '@nestjs/common';
import { MarkCategoryController } from '../controllers/mark-category.controller';
import { MarkCategoryService } from '../services/mark-category.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkCategoryRepository } from '../repositories/mark-category.repository';
import { MarkCategoryHelper } from '../helpers/mark-category.helper';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([
      MarkRepository,
      MarkCategoryRepository,
    ]),
  ],
  controllers: [MarkCategoryController],
  providers: [MarkCategoryService, MarkCategoryHelper],
  exports: [MarkCategoryService, MarkCategoryHelper],
})
export class MarkCategoryModule {}
