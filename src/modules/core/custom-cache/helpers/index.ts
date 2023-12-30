import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomCacheHelper {
  /**
   * @summary cache의 expiredTime 설정시 ms로 바꿔주는 함수
   * @author  Jason
   * @param   { string } day => 'xd' 형태로 입력해야 한다.
   * @returns { number }
   */
  convertDayToMs(day: string): number {
    const dayNumber = parseInt(day.replace('d', ''));
    const millisecondsInDay = 24 * 60 * 60;
    return dayNumber * millisecondsInDay;
  }
}
