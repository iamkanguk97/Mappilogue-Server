import { GetMarkCategoriesResponseDto } from '../dtos/get-mark-categories-response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { MarkCategoryRepository } from '../../mark/repositories/mark-category.repository';
import { DataSource } from 'typeorm';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/patch-mark-category-title-request.dto';
import { StatusColumnEnum } from 'src/constants/enum';

@Injectable()
export class MarkCategoryService {
  constructor(
    private readonly markCategoryRepository: MarkCategoryRepository,
    private readonly dataSource: DataSource,
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

  async createMarkCategory(
    userId: number,
    title: string,
  ): Promise<PostMarkCategoryResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newMarkCategoryId: number;
    let newMarkCategorySequenceNo: number;
    try {
      const lastCategorySequenceNo =
        await this.markCategoryRepository.selectLastMarkCategorySequenceNo(
          userId,
        );
      newMarkCategorySequenceNo = lastCategorySequenceNo + 1;

      newMarkCategoryId = (
        await this.markCategoryRepository.save(
          MarkCategoryEntity.from(userId, title, newMarkCategorySequenceNo),
        )
      ).id;

      await queryRunner.commitTransaction();
    } catch (err) {
      Logger.error(`[createMarkCategory] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return PostMarkCategoryResponseDto.from(
      newMarkCategoryId,
      title,
      newMarkCategorySequenceNo,
    );
  }

  async modifyMarkCategoryTitle(
    userId: number,
    body: PatchMarkCategoryTitleRequestDto,
  ): Promise<void> {
    await this.markCategoryRepository.update(
      {
        id: body.markCategoryId,
        userId,
      },
      { title: body.title },
    );
  }

  async findOneById(markCategoryId: number): Promise<MarkCategoryEntity> {
    return await this.markCategoryRepository.findOne({
      where: {
        id: markCategoryId,
        status: StatusColumnEnum.ACTIVE,
      },
    });
  }
}
