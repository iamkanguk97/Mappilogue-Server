import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as _ from 'lodash';
import { ScheduleService } from '../services/schedule.service';
import { StatusColumnEnum } from 'src/constants/enum';
import { ScheduleDto } from '../dtos/schedule.dto';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { ScheduleHelper } from '../helpers/schedule.helper';

@Injectable()
export class ScheduleValidationPipe implements PipeTransform {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly scheduleHelper: ScheduleHelper,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async transform(value: any): Promise<ScheduleDto> {
    const scheduleId = value?.scheduleId;
    const userId = this.request['user'].id;

    if (_.isNil(scheduleId)) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleIdEmpty);
    }

    const scheduleStatus = await this.scheduleService.findScheduleById(
      scheduleId,
    );

    if (!this.scheduleHelper.isScheduleExist(scheduleStatus)) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleNotExist);
    }
    if (scheduleStatus.userId !== userId) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleNotMine);
    }

    return ScheduleDto.from(scheduleStatus);
  }
}
