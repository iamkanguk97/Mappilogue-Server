import {
  SCHEDULE_ALARM_MAX_COUNT,
  SCHEDULE_DEFAULT_TITLE,
} from '../../constants/schedule.constant';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { ScheduleTitleLengthEnum } from '../../constants/schedule.enum';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { IsNumberRange } from 'src/decorators/number-range.decorator';
import { EColorIdRange } from '../../../color/variables/enums/color.enum';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { IsValidDateWithHyphen } from 'src/decorators/valid-date-with-hyphen.decorator';
import { REGEX_ALARM_OPTION } from 'src/common/regex';
import { Type } from 'class-transformer';
import { ScheduleEntity } from '../../entities/schedule.entity';
import { PostAreaOfScheduleDto } from '../post-area-of-schedule.dto';

export class PostScheduleRequestDto {
  @Length(
    ScheduleTitleLengthEnum.MIN,
    ScheduleTitleLengthEnum.MAX,
    setValidatorContext(ScheduleExceptionCode.ScheduleTitleLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  title: string = SCHEDULE_DEFAULT_TITLE;

  @IsNumberRange(
    EColorIdRange.MIN,
    EColorIdRange.MAX,
    setValidatorContext(ColorExceptionCode.ColorIdRangeError),
  )
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleColorIdEmpty))
  colorId!: number;

  @IsValidDateWithHyphen(
    setValidatorContext(ScheduleExceptionCode.ScheduleStartDateInvalidFormat),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleStartDateEmpty))
  startDate!: string;

  @IsValidDateWithHyphen(
    setValidatorContext(ScheduleExceptionCode.ScheduleEndDateInvalidFormat),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleEndDateEmpty))
  endDate!: string;

  @Matches(REGEX_ALARM_OPTION, {
    each: true,
    ...setValidatorContext(
      ScheduleExceptionCode.ScheduleAlarmOptionFormatError,
    ),
  })
  @ArrayMaxSize(
    SCHEDULE_ALARM_MAX_COUNT,
    setValidatorContext(ScheduleExceptionCode.ScheduleAlarmMaxFive),
  )
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  // @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsOptional()
  alarmOptions: string[] = [];

  @ValidateNested({ each: true })
  @Type(() => PostAreaOfScheduleDto)
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  // @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsOptional()
  area: PostAreaOfScheduleDto[] = [];

  /**
   * @summary ScheduleEntity로 변환하는 함수
   * @author  Jason
   * @param   { number } userId
   * @returns { ScheduleEntity }
   */
  toScheduleEntity(userId: number): ScheduleEntity {
    return ScheduleEntity.from(
      userId,
      this.colorId,
      this.startDate,
      this.endDate,
      this.title,
      this.alarmOptions,
    );
  }
}
