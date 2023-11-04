import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as _ from 'lodash';
import { ScheduleService } from '../services/schedule.service';
import { ScheduleDto } from '../dtos/schedule.dto';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';

@Injectable()
export class ScheduleValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ScheduleValidationPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly scheduleService: ScheduleService,
  ) {}

  async transform<T extends { scheduleId: number }>(
    value: T,
  ): Promise<ScheduleDto> {
    try {
      const scheduleId = value?.scheduleId;
      const userId = this.request['user'].id;

      if (_.isNil(scheduleId)) {
        throw new BadRequestException(ScheduleExceptionCode.ScheduleIdEmpty);
      }

      const result = await this.scheduleService.checkScheduleStatus(
        userId,
        scheduleId,
      );

      return result;
    } catch (err) {
      this.logger.error(`[ScheduleValidationPipe] ${err}`);
      throw err;
    }
  }
}
