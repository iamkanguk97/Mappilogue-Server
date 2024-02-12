import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsValidDateWithHyphen } from 'src/decorators/valid-date-with-hyphen.decorator';
import { PostAreaOfScheduleValueDto } from './post-area-of-schedule-value.dto';
import { setValidatorContext } from 'src/common/common';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';

export class PostAreaOfScheduleDto {
  // 참고) 해당 date가 startDate와 endDate 사이의 날짜인지는 Service에서 확인
  @IsValidDateWithHyphen(
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaDateInvalidFormat),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleAreaDateEmpty))
  date!: string;

  @ValidateNested({ each: true })
  @Type(() => PostAreaOfScheduleValueDto)
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  // @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleAreaValueEmpty))
  value!: PostAreaOfScheduleValueDto[];
}
