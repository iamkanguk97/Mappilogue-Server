import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';

@Injectable()
export class MarkService {
  private readonly logger = new Logger(MarkService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly markRepository: MarkRepository,
  ) {}

  async createMark(userId: number, files: Express.MulterS3.File[], body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // colorId가 있음 -> scheduleId가 null이 아닌경우 ==> update 필요

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
