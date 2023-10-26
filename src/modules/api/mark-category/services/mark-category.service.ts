import { Injectable, Logger } from '@nestjs/common';
import { MarkCategoryRepository } from '../../mark/repositories/mark-category.repository';
import { DataSource } from 'typeorm';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';

@Injectable()
export class MarkCategoryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly markCategoryRepository: MarkCategoryRepository,
  ) {}

  async createMarkCategory(
    userId: number,
    title: string,
  ): Promise<PostMarkCategoryResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newMarkCategoryId: number;
    let newMarkCategorySequenceNo: number;
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
    } catch (err) {
      Logger.error(`[createMarkCategory] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return PostMarkCategoryResponseDto.from(
      newMarkCategoryId,
      title,
      newMarkCategorySequenceNo,
    );
  }
}
