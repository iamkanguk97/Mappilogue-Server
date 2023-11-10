import { DataSource, Equal } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import { MarkHelper } from '../helpers/mark.helper';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';
import { MarkMetadataRepository } from '../repositories/mark-metadata.repository';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { PostMarkResponseDto } from '../dtos/post-mark-response.dto';
import { MarkLocationRepository } from '../repositories/mark-location.repository';
import { isDefined } from 'src/helpers/common.helper';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkDto } from '../dtos/mark.dto';
import { GetMarkDetailByIdResponseDto } from '../dtos/get-mark-detail-by-id-response.dto';
import { MarkCategoryRepository } from '../repositories/mark-category.repository';
import { MarkLocationDto } from '../dtos/mark-location.dto';

@Injectable()
export class MarkService {
  private readonly logger = new Logger(MarkService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
    private readonly markMetadataRepository: MarkMetadataRepository,
    private readonly markLocationRepository: MarkLocationRepository,
    private readonly markCategoryRepository: MarkCategoryRepository,
    private readonly scheduleService: ScheduleService,
    private readonly markHelper: MarkHelper,
  ) {}

  async createMark(
    userId: number,
    files: Express.MulterS3.File[],
    body: PostMarkRequestDto,
  ): Promise<PostMarkResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id: markId } = await this.markRepository.save(
        body.toMarkEntity(userId),
      );
      await this.modifyScheduleColorByCreateMark(body);
      await this.createMarkMetadata(markId, files, body);
      await this.createMarkMainLocation(markId, body);

      await queryRunner.commitTransaction();
      return PostMarkResponseDto.of(markId);
    } catch (err) {
      this.logger.error(`[createMark - transaction error] ${err}`);
      await this.markHelper.deleteUploadedMarkImageWhenError(userId, files);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findMarkOnSpecificId(
    mark: MarkDto,
  ): Promise<GetMarkDetailByIdResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const markCategoryName =
        (
          await this.markCategoryRepository.findOne({
            select: {
              title: true,
            },
            where: {
              id: Equal(mark.getMarkCategoryId),
              status: StatusColumnEnum.ACTIVE,
            },
          })
        ).title ?? '';

      const markLocation = await this.markLocationRepository.findOne({
        where: {
          markId: mark.getId,
          status: StatusColumnEnum.ACTIVE,
        },
      });

      const param = {
        markCategoryId: mark.getMarkCategoryId,
        markCategoryName,
        markLocation: MarkLocationDto.of(markLocation),
        content: mark.getContent,
      };

      // metadata 부분 조회하기
      const markMetadatas =
        await this.markMetadataRepository.selectMarkMetadatasByMarkId(
          mark.getId,
        );

      await queryRunner.commitTransaction();
      return GetMarkDetailByIdResponseDto.from(param, markMetadatas);
    } catch (err) {
      this.logger.error(`[findMarkOnSpecificId - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findMarkListByCategoryId(userId: number, markCategoryId: number) {
    // markCategoryId가 -1이면 전체 카테고리, 아니면 특정 카테고리
    return;
  }

  async createMarkMetadata(
    markId: number,
    files: Express.MulterS3.File[],
    body: PostMarkRequestDto,
  ): Promise<void> {
    const metadata = body.markMetadata ?? [];
    await this.markMetadataRepository.save(
      this.markHelper.mappingMarkMetadataWithImages(markId, files, metadata),
    );
  }

  async createMarkMainLocation(
    markId: number,
    body: PostMarkRequestDto,
  ): Promise<void> {
    if (isDefined(body.mainScheduleAreaId) || isDefined(body.mainLocation)) {
      const insertMarkLocationParam =
        this.markHelper.setCreateMarkLocationParam(markId, body);
      await this.markLocationRepository.save(insertMarkLocationParam);
    }
  }

  async modifyScheduleColorByCreateMark(
    body: PostMarkRequestDto,
  ): Promise<void> {
    if (isDefined(body.scheduleId)) {
      await this.scheduleService.modifyById(body.scheduleId, {
        colorId: body.colorId,
      });
    }
  }

  async removeMark(userId: number, markId: number): Promise<void> {
    await this.markRepository.delete({ userId, id: markId });
  }

  async removeMarkByCategoryId(markCategoryId: number): Promise<void> {
    await this.markRepository.delete({ markCategoryId });
  }

  async modifyMarkCategoryIdToNullInMark(
    markCategoryId: number,
  ): Promise<void> {
    await this.markRepository.update(
      { markCategoryId },
      { markCategoryId: () => 'NULL' },
    );
  }

  async findOneById(markId: number): Promise<MarkEntity> {
    return await this.markRepository.findOne({
      where: {
        id: markId,
        status: StatusColumnEnum.ACTIVE,
      },
    });
  }

  async checkMarkStatus(userId: number, markId: number): Promise<MarkDto> {
    const markStatus = await this.findOneById(markId);

    if (!this.markHelper.isMarkExist(markStatus)) {
      throw new BadRequestException(MarkExceptionCode.MarkNotExist);
    }
    if (markStatus.userId !== userId) {
      throw new BadRequestException(MarkExceptionCode.MarkNotMine);
    }

    return MarkDto.of(markStatus);
  }
}
