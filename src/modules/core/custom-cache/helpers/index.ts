import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomCacheHelper {
  // day는 xd 형태로 입력해야 함.
  convertDayToMs(day: string): number {
    const dayNumber = parseInt(day.replace('d', ''));
    const millisecondsInDay = 24 * 60 * 60;
    return dayNumber * millisecondsInDay;
  }
}
