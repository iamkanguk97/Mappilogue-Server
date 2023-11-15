import { Injectable } from '@nestjs/common';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { MarkCategoryRequestDto } from '../dtos/mark-category-request.dto';

@Injectable()
export class MarkCategoryHelper {
  /**
   * @title 두 markCategoryDto 배열에서 id만 추출해서 동일한지 확인하는 함수
   * @comment 기록 카테고리 수정 기능시 사용됨
   * @param beforeUpdateDto
   * @param updateDto
   * @returns
   */
  isMarkCategoryEqualWithRequestById(
    beforeUpdateDto: MarkCategoryDto[],
    updateDto: MarkCategoryRequestDto[],
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
