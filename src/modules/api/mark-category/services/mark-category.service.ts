import { GetMarkCategoriesResponseDto } from '../dtos/get-mark-categories-response.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MarkCategoryRepository } from '../../mark/repositories/mark-category.repository';
import { DataSource } from 'typeorm';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/patch-mark-category-title-request.dto';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { MarkCategoryHelper } from '../helpers/mark-category.helper';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { DeleteMarkCategoryOptionEnum } from '../constants/mark-category.enum';
import { MarkService } from '../../mark/services/mark.service';
import { MarkRepository } from '../../mark/repositories/mark.repository';
import { isDefined } from 'src/helpers/common.helper';
import { MarkCategoryRequestDto } from '../dtos/mark-category-request.dto';

@Injectable()
export class MarkCategoryService {
  private readonly logger = new Logger(MarkCategoryService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
    private readonly markCategoryRepository: MarkCategoryRepository,
    private readonly markService: MarkService,
    private readonly markCategoryHelper: MarkCategoryHelper,
  ) {}

  async findMarkCategories(
    userId: number,
  ): Promise<GetMarkCategoriesResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      await queryRunner.commitTransaction();
      return GetMarkCategoriesResponseDto.from(
        totalCategoryMarkCount,
        result.map((r) => MarkCategoryDto.of(r)),
      );
    } catch (err) {
      this.logger.error(`[findMarkCategories - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createMarkCategory(
    userId: number,
    title: string,
  ): Promise<PostMarkCategoryResponseDto> {
    let newMarkCategoryId: number;
    let newMarkCategorySequenceNo: number;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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
      return PostMarkCategoryResponseDto.from(
        newMarkCategoryId,
        title,
        newMarkCategorySequenceNo,
      );
    } catch (err) {
      this.logger.error(`[createMarkCategory - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeMarkCategory(
    userId: number,
    markCategoryId: number,
    option: DeleteMarkCategoryOptionEnum,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.markCategoryRepository.softDelete({
        userId,
        id: markCategoryId,
      });
      await this.updateMarkStatusInMarkDelete(option, markCategoryId);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[removeMarkCategory - transaction error] ${err}`);
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
    categories: MarkCategoryRequestDto[],
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
      this.logger.error(`[modifyMarkCategory - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateMarkStatusInMarkDelete(
    option: DeleteMarkCategoryOptionEnum,
    markCategoryId: number,
  ): Promise<void> {
    switch (option) {
      case DeleteMarkCategoryOptionEnum.ALL:
        await this.markService.removeMarkByCategoryId(markCategoryId);
        return;
      case DeleteMarkCategoryOptionEnum.ONLY:
        await this.markService.modifyMarkCategoryIdToNullInMark(markCategoryId);
        return;
      default:
        return;
    }
  }

  async checkMarkCategoryStatus(
    userId: number,
    markCategoryId: number,
  ): Promise<void> {
    const markCategoryStatus = await this.findOneById(markCategoryId);

    if (!isDefined(markCategoryStatus)) {
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

  async findOneById(markCategoryId: number): Promise<MarkCategoryEntity> {
    return await this.markCategoryRepository.findOne({
      where: {
        id: markCategoryId,
      },
    });
  }
}
