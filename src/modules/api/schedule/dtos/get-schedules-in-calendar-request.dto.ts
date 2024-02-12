import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';

export class GetSchedulesInCalendarRequestDto {
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @Type(() => Number)
  @IsNotEmpty(
    setValidatorContext(ScheduleExceptionCode.CalendarSearchYearEmpty),
  )
  year!: number;

  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @Type(() => Number)
  @IsNotEmpty(
    setValidatorContext(ScheduleExceptionCode.CalendarSearchMonthEmpty),
  )
  month!: number;
}
