import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { REGEX_SCHEDULE_AREA_TIME } from 'src/common/regex';
import {
  ScheduleAreaLatitudeLengthEnum,
  ScheduleAreaLongitudeLengthEnum,
  ScheduleAreaNameLengthEnum,
  ScheduleAreaStreetAddressLengthEnum,
  ScheduleAreaTimeLengthEnum,
} from '../constants/schedule.enum';

export class ScheduleAreaValueDto {
  @Length(
    ScheduleAreaNameLengthEnum.MIN,
    ScheduleAreaNameLengthEnum.MAX,
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaNameLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(ScheduleExceptionCode.ScheduleAreaNameEmpty))
  name: string;

  @Length(
    ScheduleAreaStreetAddressLengthEnum.MIN,
    ScheduleAreaStreetAddressLengthEnum.MAX,
    setValidatorContext(
      ScheduleExceptionCode.ScheduleAreaStreetAddressLengthError,
    ),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  streetAddress?: string | undefined;

  @Length(
    ScheduleAreaLatitudeLengthEnum.MIN,
    ScheduleAreaLatitudeLengthEnum.MAX,
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaLatitudeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  latitude?: string | undefined;

  @Length(
    ScheduleAreaLongitudeLengthEnum.MIN,
    ScheduleAreaLongitudeLengthEnum.MAX,
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaLongitudeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  longitude?: string | undefined;

  @Matches(
    REGEX_SCHEDULE_AREA_TIME,
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaTimeErrorFormat),
  )
  @Length(
    ScheduleAreaTimeLengthEnum.MIN,
    ScheduleAreaTimeLengthEnum.MAX,
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaTimeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  time?: string | undefined;
}
