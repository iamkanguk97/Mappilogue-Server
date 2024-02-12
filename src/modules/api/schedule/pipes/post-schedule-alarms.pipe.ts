import { Injectable, PipeTransform } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/request/post-schedule-request.dto';

import * as moment from 'moment';

@Injectable()
export class PostScheduleAlarmsPipe implements PipeTransform {
  /**
   * @summary alarmOptions를 추출해서 시간 지난것들은 없앰
   * @author  Jason
   * @param   { PostScheduleRequestDto } value
   */
  transform(value: PostScheduleRequestDto): PostScheduleRequestDto {
    const nowDate = moment().format('YYYY-MM-DDThh:mm:ss');
    const alarmOptions = value.alarmOptions;

    const result = alarmOptions.filter(
      (alarm) => moment(nowDate) < moment(alarm),
    );

    value.alarmOptions = result;
    return value;
  }
}
