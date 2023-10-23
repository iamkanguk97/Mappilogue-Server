import { Injectable, Logger } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { setCheckColumnByValue } from 'src/helpers/common.helper';
import { DataSource } from 'typeorm';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { ScheduleEntity } from '../entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async create(userId: number, body: PostScheduleRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // const hello = PostScheduleRequestDto.toEntity(userId, body);
      // console.log(hello);
      const newScheduleId = await this.scheduleRepository.insertSchedule(
        ScheduleEntity.from(userId, body),
      );
      console.log(newScheduleId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.error(`[create - Schedule Domain] ${err}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
