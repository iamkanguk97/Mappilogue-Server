import { Injectable, PipeTransform } from '@nestjs/common';
import { GetMarkSearchByOptionRequestDto } from '../dtos/request/get-mark-search-by-option-request.dto';

@Injectable()
export class GetMarkSearchByOptionKeywordPipe implements PipeTransform {
  transform(
    value: GetMarkSearchByOptionRequestDto,
  ): GetMarkSearchByOptionRequestDto {
    const result = value.keyword.substring(1);
    value.keyword = result;

    return value;
  }
}
