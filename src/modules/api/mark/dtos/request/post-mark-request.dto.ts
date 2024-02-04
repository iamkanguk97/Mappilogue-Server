import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { IsNumberRange } from 'src/decorators/number-range.decorator';
import { ColorIdRangeEnum } from '../../../color/constants/color.enum';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import {
  MarkLocationLatitudeLengthEnum,
  MarkLocationLongitudeLengthEnum,
  MarkLocationNameLengthEnum,
  MarkLocationStreetAddressLengthEnum,
  MarkTitleLengthEnum,
} from '../../constants/enums/mark.enum';
import { Type } from 'class-transformer';
import { MarkEntity } from '../../entities/mark.entity';
import { MarkLocationEntity } from '../../entities/mark-location.entity';
import { isDefined, isEmptyObject } from 'src/helpers/common.helper';
import { MARK_DEFAULT_TITLE } from '../../constants/mark.constant';
import { PickType } from '@nestjs/mapped-types';
import { MarkMetadataEntity } from '../../entities/mark-metadata.entity';
import { CheckColumnEnum } from 'src/constants/enum';

export class PostMarkMainLocationObject extends PickType(MarkLocationEntity, [
  'name',
  'streetAddress',
  'latitude',
  'longitude',
] as const) {
  @Length(
    MarkLocationNameLengthEnum.MIN,
    MarkLocationNameLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationNameLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkLocationNameEmpty))
  name!: string;

  @Length(
    MarkLocationStreetAddressLengthEnum.MIN,
    MarkLocationStreetAddressLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationStreetAddressLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  streetAddress?: string | undefined = '';

  @Length(
    MarkLocationLatitudeLengthEnum.MIN,
    MarkLocationLatitudeLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationLatitudeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  latitude?: string | undefined = '';

  @Length(
    MarkLocationLongitudeLengthEnum.MIN,
    MarkLocationLongitudeLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkLocationLongitudeLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  longitude?: string | undefined = '';

  /**
   * @summary 기록 대표위치를 직접 추가로 했을 때 저장하는 함수
   * @author  Jason
   * @param   { number } markId
   * @returns { MarkLocationEntity }
   */
  toMarkLocationEntityWithLocationInfo(markId: number): MarkLocationEntity {
    return MarkLocationEntity.from(
      markId,
      null,
      this.longitude,
      this.name,
      this.streetAddress,
      this.latitude,
    );
  }
}

export class PostMarkMetadataObject extends PickType(MarkMetadataEntity, [
  'isMainImage',
  'caption',
] as const) {
  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(
    setValidatorContext(MarkExceptionCode.MarkMetadataIsMainImageEmpty),
  )
  isMainImage!: CheckColumnEnum;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  caption?: string | undefined = '';
}

export class PostMarkRequestDto {
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsOptional()
  markCategoryId?: number | undefined;

  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsOptional()
  scheduleId?: number | undefined;

  @IsNumberRange(
    ColorIdRangeEnum.MIN,
    ColorIdRangeEnum.MAX,
    setValidatorContext(ColorExceptionCode.ColorIdRangeError),
  )
  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkColorIdEmpty))
  colorId!: number;

  @Length(
    MarkTitleLengthEnum.MIN,
    MarkTitleLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkTitleLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  // @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkTitleEmpty))
  title?: string | undefined;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  content?: string | undefined;

  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsOptional()
  mainScheduleAreaId?: number | undefined;

  @ValidateNested({ each: true })
  @Type(() => PostMarkMainLocationObject)
  @ValidateIf((obj, value) => isDefined(value) && !isEmptyObject(value))
  @IsOptional()
  mainLocation?: PostMarkMainLocationObject | undefined;

  @ValidateNested({ each: true })
  @Type(() => PostMarkMetadataObject)
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsOptional()
  markMetadata?: PostMarkMetadataObject[] | undefined = [];

  /**
   * @summary 기록 제목 결정하는 함수
   * @author  Jason
   * @param   { string } title
   * @returns { string }
   */
  setMarkTitleByParam(title: string): string {
    return !isDefined(title) || !title.length ? MARK_DEFAULT_TITLE : title;
  }

  /**
   * @summary MarkEntity로 변환하는 함수
   * @author  Jason
   * @param   { number } userId
   * @returns { MarkEntity }
   */
  toMarkEntity(userId: number): MarkEntity {
    return MarkEntity.from(
      userId,
      this.setMarkTitleByParam(this.title),
      this.colorId,
      this.markCategoryId,
      this.scheduleId,
      this.content,
    );
  }

  /**
   * @summary 기록 대표위치를 일정에서 추가한 지역으로 설정하는 함수
   * @author  Jason
   * @param   { number } markId
   * @param   { number } scheduleAreaId
   * @returns { MarkLocationEntity }
   */
  toMarkLocationEntityWithScheduleAreaId(
    markId: number,
    scheduleAreaId: number,
  ): MarkLocationEntity {
    return MarkLocationEntity.from(markId, scheduleAreaId);
  }
}
