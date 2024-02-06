import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ScheduleService } from '../services/schedule.service';
import { IRequestWithUserType } from 'src/types/request-with-user.type';
import { isDefined } from 'src/helpers/common.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { ScheduleDto } from '../dtos/schedule.dto';

@Injectable()
export class ScheduleValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ScheduleValidationPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: IRequestWithUserType,
    private readonly scheduleService: ScheduleService,
  ) {}

  async transform<T extends { id: number }>(value: T) {
    try {
      const scheduleId = value.id;
      const userId = this.request.user.id;

      console.log(scheduleId);
      console.log(userId);

      if (!isDefined(scheduleId)) {
        throw new BadRequestException(ScheduleExceptionCode.ScheduleIdEmpty);
      }

      return await this.scheduleService.checkScheduleStatus(userId, scheduleId);
    } catch (err) {
      this.logger.error(`[ScheduleValidationPipe] ${err}`);
      throw err;
    }
  }
}
