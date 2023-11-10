import { Injectable } from '@nestjs/common';
import { UserAlarmSettingDto } from '../../user/dtos/user-alarm-setting.dto';
import * as _ from 'lodash';
import { CheckColumnEnum } from 'src/constants/enum';

@Injectable()
export class UserProfileHelper {
  /**
   * @title 일정 알림을 보낼 수 있는지 확인하는 함수
   * @param userAlarmSettings
   * @returns
   */
  checkCanSendScheduleAlarm(userAlarmSettings: UserAlarmSettingDto): boolean {
    return (
      !_.isNil(userAlarmSettings) &&
      userAlarmSettings.isTotalAlarm === CheckColumnEnum.ACTIVE &&
      userAlarmSettings.isScheduleReminderAlarm === CheckColumnEnum.ACTIVE
    );
  }
}
