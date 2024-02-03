import { Injectable } from '@nestjs/common';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { PutMarkCategoryObject } from '../dtos/request/put-mark-category-request.dto';

@Injectable()
export class MarkCategoryHelper {
  /**
   * @summary 두 markCategoryDto 배열에서 id만 추출해서 동일한지 확인하는 함수
   * @author  Jason
   * @param   { MarkCategoryDto[] } beforeUpdateDto
   * @param   { PutMarkCategoryObject[] } updateDto
   * @returns { boolean }
   */
  isMarkCategoryEqualWithRequestById(
    beforeUpdateDto: MarkCategoryDto[],
    updateDto: PutMarkCategoryObject[],
  ): boolean {
    const beforeUpdateIdArr = beforeUpdateDto.map((item) => item.id).sort();
    const updateIdArr = updateDto.map((item) => item.id).sort();

    if (beforeUpdateIdArr.length !== updateIdArr.length) {
      return false;
    }

    for (let i = 0; i < beforeUpdateIdArr.length; i++) {
      if (beforeUpdateIdArr[i] !== updateIdArr[i]) {
        return false;
      }
    }

    return true;
  }
}
