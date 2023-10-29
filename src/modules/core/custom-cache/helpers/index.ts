import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomCacheHelper {
  /**
   * @title cache의 expiredTime 설정시 ms로 바꿔주는 함수
   * @param day => 'xd' 형태로 입력해야 한다.
   * @returns
   */
  convertDayToMs(day: string): number {
    const dayNumber = parseInt(day.replace('d', ''));
    const millisecondsInDay = 24 * 60 * 60;
    return dayNumber * millisecondsInDay;
  }
}
