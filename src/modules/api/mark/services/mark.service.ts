import { MARK_CATEGORY_TOTAL_NAME } from '../constants/mark-category.constant';
import { DataSource, QueryRunner } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { MarkHelper } from '../helpers/mark.helper';
import { MarkMetadataRepository } from '../repositories/mark-metadata.repository';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { PostMarkResponseDto } from '../dtos/response/post-mark-response.dto';
import { MarkLocationRepository } from '../repositories/mark-location.repository';
import { isDefined } from 'src/helpers/common.helper';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkDto } from '../dtos/mark.dto';
import { GetMarkDetailByIdResponseDto } from '../dtos/response/get-mark-detail-by-id-response.dto';
import { MarkCategoryRepository } from '../repositories/mark-category.repository';
import { MarkLocationDto } from '../dtos/mark-location.dto';
import {
  PostMarkMetadataObject,
  PostMarkRequestDto,
} from '../dtos/request/post-mark-request.dto';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { MarkMetadataDto } from '../dtos/mark-metadata.dto';
import { GetMarkListByCategoryResponseDto } from '../dtos/response/get-mark-list-by-category-response.dto';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

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

  /**
   * @summary 기록 생성하기 API Service
   * @author  Jason
   *
   * @param   { number } userId
   * @param   { Express.MulterS3.File[] } files
   * @param   { PostMarkRequestDto } body
   *
   * @returns { Promise<PostMarkResponseDto> }
   */
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
      const { id: markId } = await queryRunner.manager.save(
        MarkEntity,
        body.toMarkEntity(userId),
      );

      await Promise.all([
        this.modifyScheduleColorByCreateMark(queryRunner, body), // 기록 생성시 연관되어 있는 일정의 색깔을 변경함
        this.createMarkMetadata(queryRunner, markId, files, markMetadata), // 기록 이미지 + 캡션 데이터 INSERT
        this.createMarkMainLocation(queryRunner, markId, body), // 기록 대표 위치 INSERT
      ]);

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

  /**
   * @summary 특정 기록 조회하기 API Service
   * @author  Jason
   * @param   { MarkDto } mark
   * @returns { Promise<GetMarkDetailByIdResponseDto> }
   */
  async findMarkOnSpecificId(
    mark: MarkDto,
  ): Promise<GetMarkDetailByIdResponseDto> {
    const [
      markCategoryResponse,
      markLocationResponse,
      markMetadataResponse,
      markDateResponse,
    ] = await Promise.all([
      this.setMarkCategoryOnDetail(mark),
      this.setMarkLocationOnDetail(mark.id),
      this.setMarkMetadataOnDetail(mark),
      this.setMarkDateOnDetail(mark),
    ]);

    return GetMarkDetailByIdResponseDto.from(
      mark.id,
      mark.content,
      markCategoryResponse,
      markLocationResponse,
      markDateResponse,
      markMetadataResponse,
    );
  }

  /**
   * @summary 기록 삭제 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { number } markId
   */
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
   * @summary 기록 수정하기 API Service
   * @author  Jason
   */
  async modifyMark() {
    return;
  }

  /**
   * @summary 특정 카테고리의 기록 조회하기 API Service
   * @author  Jason
   *
   * @param   { number } userId
   * @param   { number } markCategoryId
   * @param   { PageOptionsDto } pageOptionsDto
   *
   * @returns { Promise<ResultWithPageDto<GetMarkListByCategoryResponseDto>> }
   */
  async findMarkListByCategory(
    userId: number,
    markCategoryId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<GetMarkListByCategoryResponseDto>> {
    const result = await this.markRepository.selectMarkListByCategory(
      userId,
      markCategoryId,
      pageOptionsDto,
    );

    return ResultWithPageDto.from(
      GetMarkListByCategoryResponseDto.from(result.result),
      result.meta,
    );
  }

  /**
   * @summary 기록 Metadata Insert하는 함수
   * @author  Jason
   *
   * @param   { QueryRunner } queryRunner
   * @param   { number } markId
   * @param   { Express.MulterS3.File[] } files
   * @param   { PostMarkMetadataObject[] } metadata
   */
  async createMarkMetadata(
    queryRunner: QueryRunner,
    markId: number,
    files: Express.MulterS3.File[],
    metadata: PostMarkMetadataObject[],
  ): Promise<void> {
    await queryRunner.manager.save(
      MarkMetadataEntity,
      this.markHelper.mappingMarkMetadataWithImages(markId, files, metadata),
    );
  }

  /**
   * @summary 기록 대표위치 저장하는 함수
   * @author  Jason
   *
   * @param   { QueryRunner } queryRunner
   * @param   { number } markId
   * @param   { PostMarkRequestDto } body
   */
  async createMarkMainLocation(
    queryRunner: QueryRunner,
    markId: number,
    body: PostMarkRequestDto,
  ): Promise<void> {
    if (isDefined(body.mainScheduleAreaId) || isDefined(body.mainLocation)) {
      const insertMarkLocationParam =
        this.markHelper.setCreateMarkLocationParam(markId, body);

      await queryRunner.manager.save(
        MarkLocationRepository,
        insertMarkLocationParam,
      );
    }
  }

  /**
   * @summary 기록 생성 시 일정 색깔 연동 후 변경하는 함수
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { PostMarkRequestDto } body
   */
  async modifyScheduleColorByCreateMark(
    queryRunner: QueryRunner,
    body: PostMarkRequestDto,
  ): Promise<void> {
    if (isDefined(body.scheduleId)) {
      await this.scheduleService.modifyById(
        body.scheduleId,
        {
          colorId: body.colorId,
        },
        queryRunner,
      );
    }
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

  /**
   * @summary Find one mark by markId
   * @author  Jason
   * @param   { number } markId
   * @returns { Promise<MarkEntity> }
   */
  async findOneById(markId: number): Promise<MarkEntity> {
    return await this.markRepository.findOne({
      where: {
        id: markId,
      },
    });
  }

  /**
   * @summary 기록 상태확인
   * @author  Jason
   * @param   { number } userId
   * @param   { number } markId
   * @returns { Promise<MarkDto> }
   */
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
   * @summary     기록 조회하기 API - MarkLocation 설정하기
   * @description scheduleAreaId가 null이면 MarkLocation에서 select, 아니면 join 후 select
   * @author      Jason
   * @param       { number } markId
   * @returns     { MarkLocationDto }
   */
  async setMarkLocationOnDetail(markId: number): Promise<MarkLocationDto> {
    const markLocationStatus = await this.markLocationRepository.findOne({
      where: {
        markId,
      },
    });

    // 해당 기록의 장소에서 scheduleAreaId가 null이 아닌 경우
    if (isDefined(markLocationStatus.scheduleAreaId)) {
      return MarkLocationDto.of(
        await this.markLocationRepository.selectMarkLocationWithScheduleArea(
          markId,
        ),
      );
    }
    return MarkLocationDto.of(markLocationStatus);
  }

  /**
   * @summary 특정 기록 조회 API Service -> Category 부분 조회하는 함수
   * @author  Jason
   * @param   { MarkDto } mark
   * @returns { Promise<Partial<MarkCategoryDto>> }
   */
  async setMarkCategoryOnDetail(
    mark: MarkDto,
  ): Promise<Partial<MarkCategoryDto>> {
    const markCategoryId = mark.markCategoryId;
    const title = !isDefined(markCategoryId)
      ? MARK_CATEGORY_TOTAL_NAME
      : await this.markCategoryRepository.findOne({
          select: {
            title: true,
          },
          where: {
            id: markCategoryId,
          },
        });

    return {
      id: markCategoryId,
      title,
    } as Partial<MarkCategoryDto>;
  }

  /**
   * @summary 특정 기록 조회 API Service -> Metadata 부분 조회하는 함수
   * @author  Jason
   * @param   { MarkDto } mark
   * @returns { Promise<MarkMetadataDto[]> }
   */
  async setMarkMetadataOnDetail(mark: MarkDto): Promise<MarkMetadataDto[]> {
    return (
      await this.markMetadataRepository.selectMarkMetadatasByMarkId(mark.id)
    ).map((metadata) => MarkMetadataDto.of(metadata));
  }

  /**
   * @summary 특정 기록 조회 API Service -> 날짜 부분 조회하는 함수
   * @author  Jason
   * @param   { MarkDto } mark
   * @returns { Promise<string> }
   */
  async setMarkDateOnDetail(mark: MarkDto): Promise<string> {
    /**
     * @TODO 연결된 scheduleId (areaId)가 있는 경우에는 그 장소의 날짜
     * - 없으면 Mark의 createdAt
     */
    if (isDefined(mark.scheduleId)) {
      return '2023년 12월 19일'; // 곧 수정할거임!
    }
    return mark.createdAt;
  }
}
