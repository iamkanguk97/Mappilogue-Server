import { Injectable } from '@nestjs/common';
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
import { PostScheduleRequestDto } from '../dtos/request/post-schedule-request.dto';
import { Notification } from 'firebase-admin/lib/messaging/messaging-api';

import * as moment from 'moment';

@Injectable()
export class ScheduleHelper {
  constructor(private readonly colorService: ColorService) {}

  /**
   * @title   일정 알림 메세지 제공하는 함수
   * @author  Jason
   * @param   { PostScheduleRequestDto } body
   * @returns { Notification }
   */
  generateScheduleNotificationMessage(
    body: PostScheduleRequestDto,
  ): Notification {
    const [, startDateMonth, startDateDay] = body.startDate.split('-');

    return {
      title: body.title,
      body: `${startDateMonth}월 ${startDateDay}일에 있을 일정을 알려드려요!`,
    };
  }

  /**
   * @summary 양력->음력 변환결과를 가지고 음력날짜 구하는 함수
   * @author  Jason
   * @param   { number | ISolarToLunarResult } result
   * @returns { string }
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
   * @summary 특정 일정 조회하기 API Service - 시작/종료 날짜와 colorCode 설정해주는 함수
   * @author  Jason
   * @param   { ScheduleDto } schedule
   * @returns { Promise<ScheduleDto> }
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
   * @summary 일정 조회할 때 각 날짜별 일정 장소 Format 맞춰주는 함수
   * @author  Jason
   * @param   { IScheduleAreasById } scheduleAreas
   * @returns { IProcessedScheduleAreasById[] }
   */
  preprocessScheduleAreaOnDetailById(
    scheduleAreas: IScheduleAreasById[],
  ): IProcessedScheduleAreasById[] {
    const result: IProcessedScheduleAreasById[] = [];

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
      } as Omit<IScheduleAreasById, 'scheduleId' | 'date'>;
      temp.value.push(transformedItem);

      if (!result.some((r) => r.date === dateKey)) {
        result.push(temp);
      }
    }

    return result;
  }
}
