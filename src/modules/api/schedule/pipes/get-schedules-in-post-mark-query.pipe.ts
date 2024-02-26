import { BadRequestException, PipeTransform } from '@nestjs/common';
import { GetSchedulesInPostMarkRequestDto } from '../dtos/request/get-schedules-in-post-mark-request.dto';
import { isNumeric } from 'src/helpers/common.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';

export class GetSchedulesInPostMarkQueryPipe implements PipeTransform {
  transform(
    value: GetSchedulesInPostMarkRequestDto,
  ): GetSchedulesInPostMarkRequestDto {
    if (
      !(isNumeric(value.month.toString()) && isNumeric(value.year.toString()))
    ) {
      throw new BadRequestException(
        ScheduleExceptionCode.YearAndMonthMustNumericString,
      );
    }

    value.year = Number(value.year);
    value.month = Number(value.month);

    return value;
  }
}
