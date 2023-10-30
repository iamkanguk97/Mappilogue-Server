import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetScheduleInCalenderRequestDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  month: number;
}
