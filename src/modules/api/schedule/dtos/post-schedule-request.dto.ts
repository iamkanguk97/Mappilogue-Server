import { SCHEDULE_ALARM_MAX_COUNT } from './../constants/schedule.constant';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
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
import { ScheduleTitleLengthEnum } from '../constants/schedule.enum';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { IsNumberRange } from 'src/decorators/number-range.decorator';
import { ColorIdRangeEnum } from '../../color/constants/color.enum';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { IsValidDateWithHyphen } from 'src/decorators/valid-date-with-hyphen.decorator';
import { REGEX_ALARM_OPTION } from 'src/common/regex';
import { Type, plainToClass, plainToInstance } from 'class-transformer';
import { ScheduleAreaObjectDto } from './schedule-area-object.dto';
import { ScheduleEntity } from '../entities/schedule.entity';
import { setCheckColumnByValue } from 'src/helpers/common.helper';
import { UserEntity } from '../../user/entities/user.entity';
import { ColorEntity } from '../../color/entities/color.entity';

export class PostScheduleRequestDto {
  @Length(
    ScheduleTitleLengthEnum.MIN,
    ScheduleTitleLengthEnum.MAX,
    setValidatorContext(ScheduleExceptionCode.ScheduleTitleLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  title?: string | undefined;

  @IsNumberRange(
    ColorIdRangeEnum.MIN,
    ColorIdRangeEnum.MAX,
    setValidatorContext(ColorExceptionCode.ColorIdRangeError),
  )
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleColorIdEmpty))
  colorId: number;

  @IsValidDateWithHyphen(
    setValidatorContext(ScheduleExceptionCode.ScheduleStartDateInvalidFormat),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleStartDateEmpty))
  startDate: string;

  @IsValidDateWithHyphen(
    setValidatorContext(ScheduleExceptionCode.ScheduleEndDateInvalidFormat),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleEndDateEmpty))
  endDate: string;

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
  @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsOptional()
  alarmOptions?: string[] | undefined;

  @ValidateNested({ each: true })
  @Type(() => ScheduleAreaObjectDto)
  @ArrayUnique(setValidatorContext(CommonExceptionCode.ArrayUnique))
  @ArrayNotEmpty(setValidatorContext(CommonExceptionCode.ArrayNotEmpty))
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsOptional()
  area?: ScheduleAreaObjectDto[] | undefined;

  static toEntity(
    userId: number,
    body: PostScheduleRequestDto,
  ): ScheduleEntity {
    const scheduleEntity = new ScheduleEntity();

    scheduleEntity.user = plainToClass(UserEntity, userId);
    // scheduleEntity.color.id = body.colorId;
    scheduleEntity.color = plainToInstance(ColorEntity, body.colorId);
    scheduleEntity.title = body.title;
    scheduleEntity.startDate = body.startDate;
    scheduleEntity.endDate = body.endDate;
    scheduleEntity.isAlarm = setCheckColumnByValue(body.alarmOptions);

    console.log(scheduleEntity);

    return scheduleEntity;
  }
}