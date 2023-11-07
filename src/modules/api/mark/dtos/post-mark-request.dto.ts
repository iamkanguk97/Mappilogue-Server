import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { IsNumberRange } from 'src/decorators/number-range.decorator';
import { ColorIdRangeEnum } from '../../color/constants/color.enum';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkTitleLengthEnum } from '../constants/mark.enum';
import { MarkMetadataDto } from './mark-metadata.dto';
import { Type } from 'class-transformer';
import { MarkEntity } from '../entities/mark.entity';
import { MarkMainLocationDto } from './mark-main-location.dto';
import { MarkLocationEntity } from '../entities/mark-location.entity';

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
  colorId: number;

  @Length(
    MarkTitleLengthEnum.MIN,
    MarkTitleLengthEnum.MAX,
    setValidatorContext(MarkExceptionCode.MarkTitleLengthError),
  )
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkTitleEmpty))
  title: string;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  content?: string | undefined;

  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsOptional()
  mainScheduleAreaId?: number | undefined;

  @ValidateNested({ each: true })
  @Type(() => MarkMainLocationDto)
  @IsOptional()
  mainLocation?: MarkMainLocationDto | undefined;

  @ValidateNested({ each: true })
  @Type(() => MarkMetadataDto)
  @IsArray(setValidatorContext(CommonExceptionCode.MustArrayType))
  @IsOptional()
  markMetadata?: MarkMetadataDto[] | undefined;

  toMarkEntity(userId: number): MarkEntity {
    return MarkEntity.from(
      userId,
      this.title,
      this.colorId,
      this.markCategoryId,
      this.scheduleId,
      this.content,
    );
  }

  toMarkLocationEntity(
    markId: number,
    scheduleAreaId: number,
  ): MarkLocationEntity {
    return MarkLocationEntity.from(markId, scheduleAreaId);
  }
}
