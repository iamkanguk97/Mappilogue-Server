import { MARK_CATEGORY_TOTAL_NAME } from './../../mark-category/constants/mark-category.constant';
import { DataSource, Equal } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
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
import { MarkMetadataDto } from '../dtos/mark-metadata.dto';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { MarkLocationDto } from '../dtos/mark-location.dto';
import { MarkMetadataV2Dto } from '../dtos/mark-metadata-v2.dto';

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

    const markMetadata = body.markMetadata ?? [];

    try {
      const { id: markId } = await this.markRepository.save(
        body.toMarkEntity(userId),
      );
      await this.modifyScheduleColorByCreateMark(body);
      await this.createMarkMetadata(markId, files, markMetadata);
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
      const markCategoryResponseParam = {
        id: mark.markCategoryId,
        title:
          (
            await this.markCategoryRepository.findOne({
              select: {
                title: true,
              },
              where: {
                id: Equal(mark.markCategoryId),
              },
            })
          )?.title ?? MARK_CATEGORY_TOTAL_NAME,
      };

      const markMainLocationResponseParam = MarkLocationDto.of(
        await this.setMarkLocationOnDetail(mark.id),
      );

      // metadata 부분 조회하기
      const markMetadatas =
        await this.markMetadataRepository.selectMarkMetadatasByMarkId(mark.id);
      const markMetadataParam = markMetadatas.map((metadata) =>
        MarkMetadataV2Dto.of(metadata),
      );

      // markDate: 연결된 scheduleId가 있는 경우 그 scheduleId의 첫 area의 date?
      // markDate: 연결된 scheduleId가 없는 경우 mark의 createdAt
      const markDateParam = {
        createdAt: mark.createdAt,
        areaDate: '',
      };

      await queryRunner.commitTransaction();
      return GetMarkDetailByIdResponseDto.from(
        mark.id,
        mark.content,
        markCategoryResponseParam,
        markMainLocationResponseParam,
        markDateParam,
        markMetadataParam,
      );
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
    metadata: MarkMetadataDto[],
  ): Promise<void> {
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
    const deletedMarkData = await this.markRepository.find({
      where: {
        userId,
        id: markId,
      },
      relations: {
        markLocation: true,
        markMetadata: true,
      },
    });

    await this.markRepository.softRemove(deletedMarkData);
  }

  /**
   * @summary 기록 카테고리 아이디로 기록 삭제하기
   * @author  Jason
   * @param   { number } markCategoryId
   */
  async removeMarkByCategoryId(markCategoryId: number): Promise<void> {
    await this.markRepository.softDelete({ markCategoryId });
  }

  /**
   * @summary 기록에서 기록 카테고리를 NULL 처리함 (전체 카테고리로)
   * @author  Jason
   * @param   { number } markCategoryId
   */
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
      },
    });
  }

  /**
   * @summary MarkId로 MarkLocation 조회
   * @author Jason
   * @param { number } markId
   * @returns { MarkLocationEntity }
   */
  async findMarkLocationByMarkId(markId: number): Promise<MarkLocationEntity> {
    return await this.markLocationRepository.findOne({
      where: {
        markId,
      },
    });
  }

  async checkMarkStatus(userId: number, markId: number): Promise<MarkDto> {
    const markStatus = await this.findOneById(markId);

    if (!isDefined(markStatus)) {
      throw new BadRequestException(MarkExceptionCode.MarkNotExist);
    }
    if (markStatus.userId !== userId) {
      throw new BadRequestException(MarkExceptionCode.MarkNotMine);
    }

    return MarkDto.of(markStatus);
  }

  /**
   * @summary 기록 조회하기 API - MarkLocation 설정하기
   * @description scheduleAreaId가 null이면 MarkLocation에서 select, 아니면 join 후 select
   * @author Jason
   * @param { number } markId
   * @returns { MarkLocationEntity }
   */
  async setMarkLocationOnDetail(markId: number): Promise<MarkLocationEntity> {
    const markLocationStatus = await this.findMarkLocationByMarkId(markId);

    if (isDefined(markLocationStatus.scheduleAreaId)) {
      return await this.markLocationRepository.selectMarkLocationWithScheduleArea(
        markId,
      );
    }
    return MarkLocationEntity.from(
      markId,
      markLocationStatus.scheduleAreaId,
      markLocationStatus.name ?? '',
      markLocationStatus.streetAddress ?? '',
      markLocationStatus.latitude ?? '',
      markLocationStatus.longitude ?? '',
    );
  }
}
