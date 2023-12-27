import { Injectable } from '@nestjs/common';
import { MarkCategoryDto } from '../dtos/mark-category.dto';
import { PutMarkCategoryObject } from '../dtos/request/put-mark-category-request.dto';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { isDefined } from 'src/helpers/common.helper';

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

  /**
   * @summary 기록 카테고리 수정시 조건 생성 함수
   * @author  Jason
   * @param   { number } id    // 기록 카테고리 아이디
   * @param   { number | undefined } userId   // 사용자 아이디
   * @returns { Pick<MarkCategoryEntity, 'id'> & Pick<Partial<MarkCategoryEntity>, 'userId'> }
   */
  setUpdateMarkCategoryCriteriaWithUserId(
    id: number,
    userId?: number | undefined,
  ): Pick<MarkCategoryEntity, 'id'> &
    Pick<Partial<MarkCategoryEntity>, 'userId'> {
    if (isDefined(userId)) {
      return { id, userId };
    }
    return { id };
  }
}
