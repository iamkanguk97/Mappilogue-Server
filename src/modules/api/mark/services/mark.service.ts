import { DataSource, QueryRunner } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { MarkHelper } from '../helpers/mark.helper';
import { MarkMetadataRepository } from '../repositories/mark-metadata.repository';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { PostMarkResponseDto } from '../dtos/response/post-mark-response.dto';
import { isDefined } from 'src/helpers/common.helper';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkDto } from '../dtos/common/mark.dto';
import { GetMarkDetailByIdResponseDto } from '../dtos/response/get-mark-detail-by-id-response.dto';
import {
  PostMarkMetadataObject,
  PostMarkRequestDto,
} from '../dtos/request/post-mark-request.dto';
import { MarkMetadataDto } from '../dtos/common/mark-metadata.dto';
import { GetMarkListByCategoryResponseDto } from '../dtos/response/get-mark-list-by-category-response.dto';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { PutMarkRequestDto } from '../dtos/request/put-mark-request.dto';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { GetMarkSearchByOptionRequestDto } from '../dtos/request/get-mark-search-by-option-request.dto';
import { EGetMarkSearchOption } from '../variables/enums/mark.enum';
import { deleteUploadedImageByKeyList } from 'src/common/multer/multer.helper';
import { NotFoundExceptionCode } from 'src/common/exception-code/api-not-found.exception-code';

@Injectable()
export class MarkService {
  private readonly logger = new Logger(MarkService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
    private readonly markMetadataRepository: MarkMetadataRepository,
    private readonly scheduleService: ScheduleService,
    private readonly markHelper: MarkHelper,
  ) {}

  /**
   * @summary 기록 생성하기 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { Express.MulterS3.File[] } files
   * @param   { PostMarkRequestDto } body
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

    try {
      const { id: markId } = await queryRunner.manager
        .getRepository(MarkEntity)
        .save(body.toMarkEntity(userId));

      await Promise.all([
        this.modifyScheduleColorByCreateMark(queryRunner, body), // 기록 생성시 연관되어 있는 일정의 색깔을 변경함
        this.createMarkMetadata(queryRunner, markId, files, body.markMetadata), // 기록 이미지 + 캡션 데이터 INSERT
        this.createMarkMainLocation(queryRunner, markId, body), // 기록 대표 위치 INSERT
      ]);

      await queryRunner.commitTransaction();
      return PostMarkResponseDto.of(markId);
    } catch (err) {
      this.logger.error(`[createMark - transaction error] ${err}`);
      await this.markHelper.deleteUploadedMarkImageWhenError(files);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
   * @summary 특정 기록 조회하기 API Service
   * @author  Jason
   * @param   { MarkDto } mark
   * @returns { Promise<GetMarkDetailByIdResponseDto> }
   */
  async findMarkOnSpecificId(
    mark: MarkDto,
  ): Promise<GetMarkDetailByIdResponseDto> {
    const [selectMarkResult, selectMarkMetadataResult] = await Promise.all([
      this.markRepository.selectMarkById(mark.id),
      this.findMarkMetadataOnDetail(mark),
    ]);

    if (!isDefined(selectMarkResult)) {
      throw new BadRequestException(MarkExceptionCode.MarkNotExist);
    }

    return GetMarkDetailByIdResponseDto.from(
      selectMarkResult,
      selectMarkMetadataResult,
    );
  }

  /**
   * @summary 특정 기록 조회 API Service -> Metadata 부분 조회하는 함수
   * @author  Jason
   * @param   { MarkDto } mark
   * @returns { Promise<MarkMetadataDto[]> }
   */
  async findMarkMetadataOnDetail(mark: MarkDto): Promise<MarkMetadataDto[]> {
    return (
      await this.markMetadataRepository.selectMarkMetadatasByMarkId(mark.id)
    ).map((metadata) => MarkMetadataDto.of(metadata));
  }

  /**
   * @summary 기록 수정하기 API Service
   * @author  Jason
   * @param   { MarkDto } mark
   * @param   { PutMarkRequestDto } body
   * @param   { Express.MulterS3.File[] } files
   */
  async modifyMark(
    mark: MarkDto,
    body: PutMarkRequestDto,
    files: Express.MulterS3.File[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.modifyMarkBaseInfo(queryRunner, mark, body),
        this.modifyScheduleColorByCreateMark(queryRunner, body),
        this.modifyMarkMetadataInfo(
          queryRunner,
          mark,
          files,
          body.markMetadata,
        ),
        this.modifyMarkMainLocationInfo(queryRunner, mark, body),
      ]);

      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      this.logger.error(`[modifyMark - transaction error] ${err}`);
      await this.markHelper.deleteUploadedMarkImageWhenError(files);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @summary 기록 수정하기 API Service -> 기록 기본정보 수정
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { MarkDto } mark
   * @param   { PutMarkRequestDto } body
   */
  async modifyMarkBaseInfo(
    queryRunner: QueryRunner,
    mark: MarkDto,
    body: PutMarkRequestDto,
  ): Promise<void> {
    await queryRunner.manager
      .getRepository(MarkEntity)
      .update({ id: mark.id }, body.toMarkEntity(mark.userId));
  }

  /**
   * @summary 기록 수정하기 API Service -> 기록 Metadata 수정
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { MarkDto } mark
   * @param   { Express.MulterS3.File[] } files
   * @param   { PostMarkMetadataObject[] } metadata
   */
  async modifyMarkMetadataInfo(
    queryRunner: QueryRunner,
    mark: MarkDto,
    files: Express.MulterS3.File[],
    metadata: PostMarkMetadataObject[],
  ): Promise<void> {
    await Promise.all([
      queryRunner.manager
        .getRepository(MarkMetadataEntity)
        .softDelete({ markId: mark.id }),
      queryRunner.manager
        .getRepository(MarkMetadataEntity)
        .save(
          this.markHelper.mappingMarkMetadataWithImages(
            mark.id,
            files,
            metadata,
          ),
        ),
    ]);

    await deleteUploadedImageByKeyList(
      (
        await this.markMetadataRepository.find({
          select: {
            markImageKey: true,
          },
          where: {
            markId: mark.id,
          },
        })
      ).map((beforeMarkMetadata) => beforeMarkMetadata.markImageKey),
    );
  }

  /**
   * @summary 특정 카테고리의 기록 조회하기 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { number } markCategoryId
   * @param   { PageOptionsDto } pageOptionsDto
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

    if (result.meta.pageCount < result.meta.pageNo) {
      throw new NotFoundException(NotFoundExceptionCode.PageNotFoundError);
    }

    return ResultWithPageDto.from(
      GetMarkListByCategoryResponseDto.of(result.data),
      result.meta,
    );
  }

  /**
   * @summary 기록 검색하기 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { GetMarkSearchByOptionRequestDto } query
   * @param   { PageOptionsDto } pageOptionsDto
   * @returns { Promise<ResultWithPageDto<IMarkSearchByArea[] | IMarkSearchByMark[]>> }
   */
  async findMarkSearchByOption(
    userId: number,
    query: GetMarkSearchByOptionRequestDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    switch (query.option) {
      case EGetMarkSearchOption.AREA:
        return await this.markRepository.selectMarkSearchByArea(
          userId,
          query,
          pageOptionsDto,
        );
      case EGetMarkSearchOption.MARK:
        return await this.markRepository.selectMarkSearchByMark(
          userId,
          query,
          pageOptionsDto,
        );
      default:
        throw new BadRequestException(
          MarkExceptionCode.MarkSearchOptionErrorType,
        );
    }
  }

  /**
   * @summary 기록 Metadata Insert하는 함수
   * @author  Jason
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
    await queryRunner.manager
      .getRepository(MarkMetadataEntity)
      .save(
        this.markHelper.mappingMarkMetadataWithImages(markId, files, metadata),
      );
  }

  /**
   * @summary 기록 대표위치 저장하는 함수
   * @author  Jason
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

      await queryRunner.manager
        .getRepository(MarkLocationEntity)
        .save(insertMarkLocationParam ?? {});
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
   * @summary 기록 카테고리 삭제하기 API Service -> 기록 카테고리 아이디로 기록 삭제하기
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { number } markCategoryId
   */
  async removeMarkByCategoryId(
    queryRunner: QueryRunner,
    markCategoryId: number,
  ): Promise<void> {
    const deletedTarget = await this.markRepository.find({
      where: {
        markCategoryId,
      },
      relations: ['markLocation', 'markMetadata'],
    });

    await queryRunner.manager
      .getRepository(MarkEntity)
      .softRemove(deletedTarget);
  }

  /**
   * @summary 기록 카테고리 삭제하기 API Service - 기록에서 기록 카테고리를 NULL 처리함 (전체 카테고리로)
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { number } markCategoryId
   */
  async modifyMarkCategoryIdToNullInMark(
    queryRunner: QueryRunner,
    markCategoryId: number,
  ): Promise<void> {
    await queryRunner.manager
      .getRepository(MarkEntity)
      .update({ markCategoryId }, { markCategoryId: () => 'NULL' });
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
   * @summary 기록 수정하기 API Service -> 기록 대표 위치 수정
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { MarkDto } mark
   * @param   { PutMarkRequestDto } body
   */
  async modifyMarkMainLocationInfo(
    queryRunner: QueryRunner,
    mark: MarkDto,
    body: PutMarkRequestDto,
  ): Promise<void> {
    if (isDefined(body.mainScheduleAreaId) || isDefined(body.mainLocation)) {
      const updateMarkLocationParam =
        this.markHelper.setCreateMarkLocationParam(mark.id, body);

      await queryRunner.manager
        .getRepository(MarkLocationEntity)
        .update({ markId: mark.id }, updateMarkLocationParam ?? {});
    }
  }

  /**
   * @summary Find one mark by markId
   * @author  Jason
   * @param   { number } markId
   * @returns { Promise<MarkEntity> }
   */
  async findOneById(markId: number): Promise<MarkEntity | null> {
    return await this.markRepository.findOne({
      where: {
        id: markId,
      },
    });
  }
}
