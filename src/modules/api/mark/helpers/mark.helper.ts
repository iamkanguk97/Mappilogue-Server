import { Injectable } from '@nestjs/common';
import { MarkEntity } from '../entities/mark.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';

@Injectable()
export class MarkHelper {
  isMarkExist(markStatus?: MarkEntity | undefined): boolean {
    return (
      !_.isNil(markStatus) && markStatus.status !== StatusColumnEnum.DELETED
    );
  }
}
