import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { ScheduleHelper } from '../../schedule/helpers/schedule.helper';
import { MarkHelper } from '../helpers/mark.helper';

@Injectable()
export class MarkService {
  private readonly logger = new Logger(MarkService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
    private readonly scheduleService: ScheduleService,
    private readonly scheduleHelper: ScheduleHelper,
    private readonly markHelper: MarkHelper,
  ) {}

  async createMark(userId: number, files: Express.MulterS3.File[], body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // colorId가 있음 -> scheduleId가 null이 아닌경우 ==> update 필요 (1)
      // markCategoryId가 있으면 => 유효성 검사 싹다 해야함 (2)

      // mainScheduleAreaId가 null이면 -> mainLocationInfo object 확인
      // mainScheduleAreaId가 null이 아니면 -> 유효성 검사 후 그대로 INSERT
      // metadata 배열이 없으면 content insert
      // metadata 배열이 있으면 -> 사진 정보와 mapping 시켜서 insert

      await this.markHelper.setScheduleColorByCreateMark(userId, body); // (1)
      // await this.markHelper.isValidMarkCategoryByCreateMark(
      //   userId,
      //   body?.markCategoryId,
      // ); // (2);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[createMark - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
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
