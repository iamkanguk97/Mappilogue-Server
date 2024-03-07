import { MarkRepository } from '../repositories/mark.repository';
import { Module } from '@nestjs/common';
import { MarkCategoryController } from '../controllers/mark-category.controller';
import { MarkCategoryService } from '../services/mark-category.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkCategoryRepository } from '../repositories/mark-category.repository';
import { MarkCategoryHelper } from '../helpers/mark-category.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { MarkCategoryValidationPipe } from '../pipes/mark-category-validation.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarkCategoryEntity]),
    CustomRepositoryModule.forCustomRepository([
      MarkRepository,
      MarkCategoryRepository,
    ]),
  ],
  controllers: [MarkCategoryController],
  providers: [
    MarkCategoryService,
    MarkCategoryHelper,
    MarkCategoryValidationPipe,
  ],
  exports: [
    MarkCategoryService,
    MarkCategoryHelper,
    MarkCategoryValidationPipe,
  ],
})
export class MarkCategoryModule {}
