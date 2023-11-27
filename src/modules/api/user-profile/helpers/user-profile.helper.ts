import { Injectable } from '@nestjs/common';
import { UserAlarmSettingDto } from '../../user/dtos/user-alarm-setting.dto';
import { CheckColumnEnum } from 'src/constants/enum';
import { isDefined } from 'src/helpers/common.helper';

@Injectable()
export class UserProfileHelper {
  /**
   * @summary 일정 알림을 보낼 수 있는지 확인하는 함수
   * @author Jason
   *
   * @param userAlarmSettings
   */
  checkCanSendScheduleAlarm(userAlarmSettings: UserAlarmSettingDto): boolean {
    return (
      isDefined(userAlarmSettings) &&
      userAlarmSettings.isTotalAlarm === CheckColumnEnum.ACTIVE &&
      userAlarmSettings.isScheduleReminderAlarm === CheckColumnEnum.ACTIVE
    );
  }
}
