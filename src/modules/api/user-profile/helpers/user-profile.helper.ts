import { Injectable } from '@nestjs/common';
import { UserAlarmSettingDto } from '../../user/dtos/user-alarm-setting.dto';
import * as _ from 'lodash';
import { CheckColumnEnum } from 'src/constants/enum';

@Injectable()
export class UserProfileHelper {
  checkCanSendScheduleAlarm(userAlarmSettings: UserAlarmSettingDto): boolean {
    return (
      !_.isNil(userAlarmSettings) &&
      userAlarmSettings.getIsTotalAlarm === CheckColumnEnum.ACTIVE &&
      userAlarmSettings.getIsScheduleReminderAlarm === CheckColumnEnum.ACTIVE
    );
  }
}
