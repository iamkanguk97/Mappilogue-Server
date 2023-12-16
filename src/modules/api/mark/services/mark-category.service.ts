import { GetMarkCategoriesResponseDto } from '../dtos/response/get-mark-categories-response.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MarkCategoryRepository } from '../repositories/mark-category.repository';
import { DataSource } from 'typeorm';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { PostMarkCategoryResponseDto } from '../dtos/response/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/request/patch-mark-category-title-request.dto';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { MarkCategoryHelper } from '../helpers/mark-category.helper';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { DeleteMarkCategoryOptionEnum } from '../constants/mark-category.enum';
import { MarkService } from './mark.service';
import { MarkRepository } from '../repositories/mark.repository';
import { isDefined } from 'src/helpers/common.helper';
import { PutMarkCategoryObject } from '../dtos/request/put-mark-category-request.dto';

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

  /**
   * @summary 기록 카테고리 조회 API Service
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<GetMarkCategoriesResponseDto> }
   */
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
        await this.markRepository.selectMarkExceptCategoryCount(userId); // 카테고리 없는 기록 개수
      const markHaveCategoryCount = result.reduce(
        (acc, obj) => acc + Number(obj.markCount),
        0,
      ); // 카테고리 있는 기록 개수: result에서 MarkCount를 더해주면 됨

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

  /**
   * @summary 기록 카테고리 생성하기 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { string } title
   * @returns { Promise<PostMarkCategoryResponseDto> }
   */
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

  /**
   * @summary 기록 카테고리 삭제 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { number } markCategoryId
   * @param   { DeleteMarkCategoryOptionEnum } option
   */
  async removeMarkCategory(
    userId: number,
    markCategoryId: number,
    option: DeleteMarkCategoryOptionEnum,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.markCategoryRepository.softDelete({ userId, id: markCategoryId }),
        this.updateMarkStatusInMarkDelete(option, markCategoryId),
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[removeMarkCategory - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @summary 기록 카테고리 이름 수정 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { PatchMarkCategoryTitleRequestDto } body
   */
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

  /**
   * @summary 기록 카테고리 수정 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { PutMarkCategoryObject[] } categories
   */
  async modifyMarkCategory(
    userId: number,
    categories: PutMarkCategoryObject[],
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

  /**
   * @summary option에 따라 Mark 삭제 여부 판단
   * @author  Jason
   * @param   { DeleteMarkCategoryOptionEnum } option
   * @param   { number } markCategoryId
   */
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
        throw new BadRequestException(
          MarkCategoryExceptionCode.DeleteMarkCategoryOptionErrorType,
        );
    }
  }

  /**
   * @summary 기록 카테고리 상태 확인 함수
   * @author  Jason
   * @param   { number } userId
   * @param   { number } markCategoryId
   */
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

  /**
   * @summary findOneById Method
   * @author  Jason
   * @param   { number } markCategoryId
   * @returns { Promise<MarkCategoryEntity> }
   */
  async findOneById(markCategoryId: number): Promise<MarkCategoryEntity> {
    return await this.markCategoryRepository.findOne({
      where: {
        id: markCategoryId,
      },
    });
  }
}
