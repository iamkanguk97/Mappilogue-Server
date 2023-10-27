import { GetMarkCategoriesResponseDto } from '../dtos/get-mark-categories-response.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MarkCategoryRepository } from '../../mark/repositories/mark-category.repository';
import { DataSource } from 'typeorm';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/patch-mark-category-title-request.dto';
import { StatusColumnEnum } from 'src/constants/enum';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { MarkCategoryHelper } from '../helpers/mark-category.helper';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';

@Injectable()
export class MarkCategoryService {
  constructor(
    private readonly markCategoryRepository: MarkCategoryRepository,
    private readonly markCategoryHelper: MarkCategoryHelper,
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

  async removeMarkCategory(
    userId: number,
    markCategoryId: number,
  ): Promise<void> {
    await this.markCategoryRepository.delete({ userId, id: markCategoryId });
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

  async modifyMarkCategory(
    userId: number,
    categories: MarkCategoryDto[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const markCategoriesBeforeUpdate =
        await this.markCategoryRepository.selectMarkCategoriesByUserId(userId);

      const isEqualWithRequestData =
        this.markCategoryHelper.isMarkCategoryEqualWithRequestById(
          MarkCategoryEntity.toDto(markCategoriesBeforeUpdate),
          categories,
        );

      if (!isEqualWithRequestData) {
        throw new BadRequestException(
          MarkCategoryExceptionCode.MarkCategoryNotEqualWithModel,
        );
      }

      await Promise.all(
        categories.map(
          async (category, idx) =>
            await this.markCategoryRepository.update(
              { id: category.id, userId },
              {
                sequence: idx + 1,
                isMarkedInMap: category.isMarkedInMap,
              },
            ),
        ),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      Logger.error(`[modifyMarkCategory] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
