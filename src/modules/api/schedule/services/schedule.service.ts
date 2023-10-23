import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { DataSource } from 'typeorm';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { checkBetweenDatesWithNoMoment } from 'src/helpers/date.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';

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
      const { id: newScheduleId } = await this.scheduleRepository.save(
        body.toEntity(userId),
      );

      const createScheduleArea = body.area ?? [];
      const { startDate, endDate } = body;
      try {
        await Promise.all(
          createScheduleArea.map(async (area) => {
            if (!checkBetweenDatesWithNoMoment(startDate, endDate, area.date)) {
              throw new BadRequestException(
                ScheduleExceptionCode.ScheduleAreaDateNotBetweenStartAndEndDate,
              );
            }
          }),
        );
      } catch (err) {
        throw err;
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.error(`[create - Schedule Domain] ${err}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
