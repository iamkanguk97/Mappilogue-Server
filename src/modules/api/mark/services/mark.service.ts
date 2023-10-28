import { Injectable } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';

@Injectable()
export class MarkService {
  constructor(private readonly markRepository: MarkRepository) {}

  async removeMark(userId: number, markId: number): Promise<void> {
    await this.markRepository.delete({ userId, id: markId });
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
