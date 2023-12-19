import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { setValidatorContext } from 'src/common/common';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt(setValidatorContext(CommonExceptionCode.MustIntegerType))
  @Min(1)
  @IsOptional()
  readonly page?: number | undefined = 1;

  @Type(() => Number)
  @IsInt(setValidatorContext(CommonExceptionCode.MustIntegerType))
  @Max(50)
  @Min(1)
  @IsOptional()
  readonly take?: number | undefined = 10;

  constructor(page: number, take: number) {
    this.page = page;
    this.take = take;
  }

  // get skip(): number {
  //   return this.page <= 0 ? (this.page = 0) : (this.page - 1) * this.take;
  // }

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
