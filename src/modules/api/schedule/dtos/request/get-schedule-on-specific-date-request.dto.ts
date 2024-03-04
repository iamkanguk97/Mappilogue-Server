import { IsNotEmpty, IsString } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { IsValidDateWithHyphen } from 'src/decorators/valid-date-with-hyphen.decorator';

export class GetScheduleOnSpecificDateRequestDto {
  @IsValidDateWithHyphen()
  @IsString(setValidatorContext(CommonExceptionCode.MustStringType))
  @IsNotEmpty()
  date!: string;
}
