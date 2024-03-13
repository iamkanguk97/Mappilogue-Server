import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { EGetMarkInUserPositionOption } from '../../variables/enums/mark.enum';
import { Type } from 'class-transformer';

export class GetMarkInUserPositionRequestDto {
  @IsEnum(
    EGetMarkInUserPositionOption,
    setValidatorContext(MarkExceptionCode.MarkUserPositionOptionWrongType),
  )
  @IsNotEmpty(
    setValidatorContext(MarkExceptionCode.MarkUserPositionOptionWrongType),
  )
  option!: EGetMarkInUserPositionOption;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(MarkExceptionCode.MarkUserPositionLeftLatitudeEmpty)
  l_lat!: string;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(MarkExceptionCode.MarkUserPositionLeftLongitudeEmpty)
  l_lon!: string;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(MarkExceptionCode.MarkUserPositionRightLatitudeEmpty)
  r_lat!: string;

  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty(MarkExceptionCode.MarkUserPositionRightLongitudeEmpty)
  r_lon!: string;

  @Type(() => Number)
  @IsOptional()
  markCategoryId: number | null = null;
}
