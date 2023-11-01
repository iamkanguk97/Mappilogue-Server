import { Module } from '@nestjs/common';
import { MarkCategoryController } from './controllers/mark-category.controller';
import { MarkCategoryService } from './services/mark-category.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkCategoryRepository } from '../mark/repositories/mark-category.repository';
import { MarkCategoryHelper } from './helpers/mark-category.helper';
import { MarkModule } from '../mark/mark.module';

@Module({
  imports: [
    MarkModule,
    CustomRepositoryModule.forCustomRepository([MarkCategoryRepository]),
  ],
  controllers: [MarkCategoryController],
  providers: [MarkCategoryService, MarkCategoryHelper],
  exports: [MarkCategoryService, MarkCategoryHelper],
})
export class MarkCategoryModule {}
