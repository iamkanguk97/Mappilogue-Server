import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import { MarkHelper } from '../helpers/mark.helper';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';
import { MarkMetadataRepository } from '../repositories/mark-metadata.repository';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { PostMarkResponseDto } from '../dtos/post-mark-response.dto';
import { MarkLocationRepository } from '../repositories/mark-location.repository';

@Injectable()
export class MarkService {
  private readonly logger = new Logger(MarkService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
    private readonly markMetadataRepository: MarkMetadataRepository,
    private readonly markLocationRepository: MarkLocationRepository,
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
    if (!_.isNil(body.mainScheduleAreaId) || !_.isNil(body.mainLocation)) {
      const insertMarkLocationParam =
        this.markHelper.setCreateMarkLocationParam(markId, body);
      await this.markLocationRepository.save(insertMarkLocationParam);
    }
  }

  async modifyScheduleColorByCreateMark(
    body: PostMarkRequestDto,
  ): Promise<void> {
    if (!_.isNil(body.scheduleId)) {
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
