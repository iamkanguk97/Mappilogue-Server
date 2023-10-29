import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from '../entities/schedule.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';
import { SCHEDULE_DEFAULT_TITLE } from '../constants/schedule.constant';

@Injectable()
export class ScheduleHelper {
  isScheduleExist(scheduleStatus?: ScheduleEntity | undefined): boolean {
    return (
      !_.isNil(scheduleStatus) &&
      scheduleStatus.status !== StatusColumnEnum.DELETED
    );
  }

  /**
   * @title 일정 알림 메세지 제공하는 함수
   * @param scheduleStartDate
   * @param scheduleTitle
   * @returns
   */
  generateScheduleNotificationMessage(
    scheduleStartDate: string,
    scheduleTitle?: string | undefined,
  ): { title: string; body: string } {
    const [, startDateMonth, startDateDay] = scheduleStartDate.split('-');

    return {
      title: scheduleTitle ?? SCHEDULE_DEFAULT_TITLE,
      body: `${startDateMonth}월 ${startDateDay}일에 있을 일정을 알려드려요!`,
    };
  }
}
