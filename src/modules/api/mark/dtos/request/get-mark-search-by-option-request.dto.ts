import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EGetMarkSearchOption } from '../../constants/enums/mark.enum';
import { setValidatorContext } from 'src/common/common';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';

export class GetMarkSearchByOptionRequestDto {
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkSearchKeywordEmpty))
  keyword!: string;

  @IsEnum(
    EGetMarkSearchOption,
    setValidatorContext(MarkExceptionCode.MarkSearchOptionErrorType),
  )
  @IsNotEmpty(setValidatorContext(MarkExceptionCode.MarkSearchOptionEmpty))
  option!: EGetMarkSearchOption;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  lat: string | null = null;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  lon: string | null = null;
}
