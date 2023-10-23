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
  ScheduleAreaNameLengthEnum,
  ScheduleAreaStreetAddressLengthEnum,
} from '../constants/schedule.enum';

export class ScheduleAreaDto {
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
  @IsNotEmpty(
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaStreetAddressEmpty),
  )
  streetAddress: string;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaLatitudeEmpty),
  )
  latitude: string;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaLongitudeEmpty),
  )
  longitude: string;

  @Matches(
    REGEX_SCHEDULE_AREA_TIME,
    setValidatorContext(ScheduleExceptionCode.ScheduleAreaTimeErrorFormat),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  time?: string | undefined;
}
