import { setValidatorContext } from 'src/common/common';
import { IsNotEmpty } from 'class-validator';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';

export class GetSchedulesInPostMarkRequestDto {
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.YearRequired))
  year!: number;

  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.MonthRequired))
  month!: number;
}
