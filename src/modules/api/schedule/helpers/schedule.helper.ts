import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from '../entities/schedule.entity';
import { CheckColumnEnum, StatusColumnEnum } from 'src/constants/enum';
import { SCHEDULE_DEFAULT_TITLE } from '../constants/schedule.constant';
import {
  IProcessedScheduleAreasById,
  IScheduleAreasById,
  ISolarToLunarResult,
} from '../types';
import { ScheduleDto } from '../dtos/schedule.dto';
import {
  getKoreanDateFormatByMultiple,
  getKoreanDateFormatBySingle,
} from 'src/helpers/date.helper';
import { ColorService } from '../../color/services/color.service';
import { UserService } from '../../user/services/user.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class ScheduleHelper {
  constructor(
    private readonly colorService: ColorService,
    private readonly userService: UserService,
  ) {}

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

  /**
   * @title 양력->음력 변환결과를 가지고 음력날짜 구하는 함수
   * @param result
   * @returns
   */
  generateLunarDateBySolarToLunarResult(
    result: number | ISolarToLunarResult,
  ): string {
    if (result === -1) {
      return '';
    }

    result = result as ISolarToLunarResult;
    return getKoreanDateFormatByMultiple(
      result.lYear,
      result.lMonth,
      result.lDay,
    );
  }

  async setScheduleOnDetailById(schedule: ScheduleDto): Promise<ScheduleDto> {
    schedule.setStartDate = getKoreanDateFormatBySingle(schedule.getStartDate);
    schedule.setEndDate = getKoreanDateFormatBySingle(schedule.getEndDate);
    schedule.setColorCode = (
      await this.colorService.findOneById(schedule.getColorId)
    ).getCode;

    return schedule;
  }

  async setScheduleAlarmsOnDetailById(
    schedule: ScheduleDto,
  ): Promise<Array<string | undefined>> {
    return schedule.getIsAlarm === CheckColumnEnum.ACTIVE
      ? await this.userService.findUserScheduleAlarms(
          schedule.getUserId,
          schedule.getId,
        )
      : [];
  }

  preprocessScheduleAreaOnDetailById(
    scheduleAreas: IScheduleAreasById[],
  ): IProcessedScheduleAreasById[] {
    const result = [];
    for (const scheduleArea of scheduleAreas) {
      const dateKey = moment(scheduleArea.date).format('M월 D일');
      const temp = result.find((r) => r.date === dateKey) || {
        date: dateKey,
        value: [],
      };

      const transformedItem = {
        scheduleAreaId: scheduleArea.scheduleAreaId,
        name: scheduleArea.name,
        streetAddress: scheduleArea.streetAddress,
        latitude: scheduleArea.latitude,
        longitude: scheduleArea.longitude,
        time: scheduleArea.time,
        sequence: scheduleArea.sequence,
      };
      temp.value.push(transformedItem);

      if (!result.some((r) => r.date === dateKey)) {
        result.push(temp);
      }
    }

    return result;
  }
}
