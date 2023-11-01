import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { IsNumberRange } from 'src/decorators/number-range.decorator';
import { ColorIdRangeEnum } from '../../color/constants/color.enum';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkTitleLengthEnum } from '../constants/mark.enum';

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

  @IsNumber({}, setValidatorContext(CommonExceptionCode.MustNumberType))
  @IsOptional()
  mainScheduleAreaId?: number | undefined;

  @IsOptional()
  mainLocationInfo?: any | undefined;

  @IsOptional()
  markMetadata: any;
}
