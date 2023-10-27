import { Injectable } from '@nestjs/common';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';
import { MarkCategoryDto } from '../dtos/mark-category.dto';

@Injectable()
export class MarkCategoryHelper {
  isMarkCategoryExist(
    markCategoryStatus?: MarkCategoryEntity | undefined,
  ): boolean {
    return (
      !_.isNil(markCategoryStatus) &&
      markCategoryStatus.status !== StatusColumnEnum.DELETED
    );
  }

  /**
   * @title 두 markCategoryDto 배열에서 id만 추출해서 동일한지 확인하는 함수
   * @comment 기록 카테고리 수정 기능시 사용됨
   * @param beforeUpdateDto
   * @param updateDto
   * @returns
   */
  isMarkCategoryEqualWithRequestById(
    beforeUpdateDto: MarkCategoryDto[],
    updateDto: MarkCategoryDto[],
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
