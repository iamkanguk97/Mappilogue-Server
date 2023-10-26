import { Injectable } from '@nestjs/common';
import { MarkCategoryRepository } from '../../mark/repositories/mark-category.repository';
import { GetMarkCategoriesResponseDto } from '../dtos/get-mark-categories-response.dto';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';

@Injectable()
export class MarkCategoryService {
  constructor(
    private readonly markCategoryRepository: MarkCategoryRepository,
  ) {}

  async findMarkCategories(userId: number) {
    /** <TODO>
     * - totalCategoryMarkCount ==> Mark 부분 작업 시작하면 UPDATE 해줘야함.
     * - query select할 때 count query도 추가해야함.
     */

    const totalCategoryMarkCount = 0; // TODO: Mark 부분 작업 시작하면 UPDATE 해줘야함.
    const result =
      await this.markCategoryRepository.selectMarkCategoriesByUserId(userId);

    return GetMarkCategoriesResponseDto.from(
      totalCategoryMarkCount,
      MarkCategoryEntity.toDto(result),
    );
  }
}
