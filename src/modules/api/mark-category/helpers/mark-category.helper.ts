import { Injectable } from '@nestjs/common';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';

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
}
