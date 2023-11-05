import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import { MarkHelper } from '../helpers/mark.helper';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';
import { MarkMetadataRepository } from '../repositories/mark-metadata.repository';
import { MarkMetadataDto } from '../dtos/mark-metadata.dto';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { PostMarkResponseDto } from '../dtos/post-mark-response.dto';

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

  async createMark(
    userId: number,
    files: Express.MulterS3.File[],
    body: PostMarkRequestDto,
  ): Promise<PostMarkResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // mainScheduleAreaId가 null이면 -> mainLocationInfo object 확인
      // mainScheduleAreaId가 null이 아니면 -> 유효성 검사 후 그대로 INSERT
      // metadata 배열이 없으면 content insert

      const { id: markId } = await this.markRepository.save({
        userId,
        title: body.title,
        markCategoryId: body.markCategoryId,
        scheduleId: body.scheduleId,
        content: '',
        colorId: body.colorId,
      });
      await this.modifyScheduleColorByCreateMark(body);
      await this.createMarkMetadata(markId, files, body?.markMetadata);

      await queryRunner.commitTransaction();
      return PostMarkResponseDto.of(markId);
    } catch (err) {
      this.logger.error(`[createMark - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createMarkMetadata(
    markId: number,
    files: Express.MulterS3.File[],
    metadata?: MarkMetadataDto[] | undefined,
  ): Promise<void> {
    await this.markMetadataRepository.save(
      this.markHelper.mappingMarkMetadataWithImages(markId, files, metadata),
    );
  }

  async modifyScheduleColorByCreateMark(
    body: PostMarkRequestDto,
  ): Promise<void> {
    if (!_.isNil(body?.scheduleId)) {
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
}
