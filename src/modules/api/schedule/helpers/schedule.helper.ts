import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from '../entities/schedule.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';

@Injectable()
export class ScheduleHelper {
  isScheduleExist(scheduleStatus?: ScheduleEntity | undefined): boolean {
    return (
      !_.isNil(scheduleStatus) &&
      scheduleStatus.status !== StatusColumnEnum.DELETED
    );
  }
}
