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
import { DeleteMarkCategoryOptionEnum } from '../constants/mark-category.enum';
import { MarkService } from '../../mark/services/mark.service';
import { MarkRepository } from '../../mark/repositories/mark.repository';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';

@Injectable()
export class MarkCategoryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
    private readonly markCategoryRepository: MarkCategoryRepository,
    private readonly customCacheService: CustomCacheService,
    private readonly markService: MarkService,
    private readonly markCategoryHelper: MarkCategoryHelper,
  ) {}

  async findMarkCategories(
    userId: number,
  ): Promise<GetMarkCategoriesResponseDto> {
    const result =
      await this.markCategoryRepository.selectMarkCategoriesByUserId(userId);

    const markExceptCategoryCount =
      await this.markRepository.selectMarkExceptCategoryCount(userId);
    const markHaveCategoryCount = result.reduce(
      (acc, obj) => acc + Number(obj.markCount),
      0,
    );

    const totalCategoryMarkCount =
      markExceptCategoryCount + markHaveCategoryCount;

    return GetMarkCategoriesResponseDto.from(
      totalCategoryMarkCount,
      result.map((r) => MarkCategoryDto.of(r)),
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
    option: DeleteMarkCategoryOptionEnum,
  ): Promise<void> {
    /**
     * 10월 29일 - 기능 추가
     * => 카테고리 삭제시 카테고리만 삭제 또는 기록까지 삭제 옵션 추가
     */

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.markCategoryRepository.delete({
        userId,
        id: markCategoryId,
      });
      await this.updateMarkStatusInMarkDelete(option, markCategoryId);

      await queryRunner.commitTransaction();
    } catch (err) {
      Logger.error(`[removeMarkCategory] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
          markCategoriesBeforeUpdate.map((r) => MarkCategoryDto.of(r)),
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

  async updateMarkStatusInMarkDelete(
    option: DeleteMarkCategoryOptionEnum,
    markCategoryId: number,
  ): Promise<void> {
    if (option === DeleteMarkCategoryOptionEnum.ALL) {
      await this.markService.removeMarkByCategoryId(markCategoryId);
      return;
    }
    await this.markService.modifyMarkCategoryIdToNullInMark(markCategoryId);
  }

  async checkMarkCategoryStatus(
    userId: number,
    markCategoryId: number,
  ): Promise<void> {
    const markCategoryStatus = await this.findOneById(markCategoryId);

    if (!this.markCategoryHelper.isMarkCategoryExist(markCategoryStatus)) {
      throw new BadRequestException(
        MarkCategoryExceptionCode.MarkCategoryNotExist,
      );
    }

    if (markCategoryStatus.userId !== userId) {
      throw new BadRequestException(
        MarkCategoryExceptionCode.MarkCategoryNotMine,
      );
    }
  }
}
