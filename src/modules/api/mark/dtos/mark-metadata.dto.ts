import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';

export class MarkMetadataDto {
  @IsEnum(
    CheckColumnEnum,
    setValidatorContext(CommonExceptionCode.MustCheckColumnType),
  )
  @IsNotEmpty(
    setValidatorContext(MarkExceptionCode.MarkMetadataIsMainImageEmpty),
  )
  isMainImage: CheckColumnEnum;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsOptional()
  caption?: string | undefined;
}
