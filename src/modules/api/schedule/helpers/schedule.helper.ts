import { Injectable } from '@nestjs/common';
import { ScheduleEntity } from '../entities/schedule.entity';
import { CheckColumnEnum } from 'src/constants/enum';
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
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { isDefined } from 'src/helpers/common.helper';

import * as moment from 'moment';

@Injectable()
export class ScheduleHelper {
  constructor(
    private readonly colorService: ColorService,
    private readonly userService: UserService,
  ) {}

  /**
   * @title check schedule is exist or not
   * @param scheduleStatus
   * @returns
   */
  isScheduleExist(scheduleStatus?: ScheduleEntity | undefined): boolean {
    return isDefined(scheduleStatus);
  }

  /**
   * @title check schedule-area is exist or not
   * @param scheduleAreaStatus
   * @returns
   */
  isScheduleAreaExist(
    scheduleAreaStatus?: ScheduleAreaEntity | undefined,
  ): boolean {
    return isDefined(scheduleAreaStatus);
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

  /**
   * @summary 일정을 조회할 때 시작/종료 날짜와 colorCode 설정해주는 함수
   * @author Jason
   *
   * @param schedule
   */
  async setScheduleOnDetail(schedule: ScheduleDto): Promise<ScheduleDto> {
    schedule.setStartDate = getKoreanDateFormatBySingle(schedule.startDate);
    schedule.setEndDate = getKoreanDateFormatBySingle(schedule.endDate);
    schedule.setColorCode = (
      await this.colorService.findOneById(schedule.colorId)
    ).code;

    return schedule;
  }

  /**
   * @summary 일정 조회할 때 형식 맞춰서 가져와주는 함수
   * @author Jason
   *
   * @param schedule
   */
  async setScheduleAlarmsOnDetail(
    schedule: ScheduleDto,
  ): Promise<Array<string | undefined>> {
    return schedule.isAlarm === CheckColumnEnum.ACTIVE
      ? await this.userService.findUserScheduleAlarms(
          schedule.userId,
          schedule.id,
        )
      : [];
  }

  /**
   * @summary 일정 조회할 때 각 날짜별 일정 장소 Format 맞춰주는 함수
   * @author Jason
   *
   * @param scheduleAreas
   */
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
