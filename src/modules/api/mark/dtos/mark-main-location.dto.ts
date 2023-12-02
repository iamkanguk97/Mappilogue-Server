import {
  MarkLocationLatitudeLengthEnum,
  MarkLocationLongitudeLengthEnum,
  MarkLocationStreetAddressLengthEnum,
} from './../constants/mark.enum';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkLocationNameLengthEnum } from '../constants/mark.enum';
import { MarkLocationEntity } from '../entities/mark-location.entity';

export class MarkMainLocationDto {
  @Length(
    MarkLocationNameLengthEnum.MIN,
    MarkLocationNameLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationNameLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkLocationNameEmpty))
  name: string;

  @Length(
    MarkLocationStreetAddressLengthEnum.MIN,
    MarkLocationStreetAddressLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationStreetAddressLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  streetAddress?: string | undefined;

  @Length(
    MarkLocationLatitudeLengthEnum.MIN,
    MarkLocationLatitudeLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationLatitudeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  latitude?: string | undefined;

  @Length(
    MarkLocationLongitudeLengthEnum.MIN,
    MarkLocationLongitudeLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationLongitudeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  longitude?: string | undefined;

  toMarkLocationEntity(
    markId: number,
    scheduleAreaId?: number | undefined,
  ): MarkLocationEntity {
    return MarkLocationEntity.from(
      markId,
      scheduleAreaId,
      this.longitude,
      this.name,
      this.streetAddress,
      this.latitude,
    );
  }
}
