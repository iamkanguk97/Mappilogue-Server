import { USER_DEFAULT_PROFILE_IMAGE } from '../variables/constants/user.constant';
import { Injectable } from '@nestjs/common';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';
import { ECheckColumn } from 'src/constants/enum';
import { isDefined } from 'src/helpers/common.helper';
import { UserEntity } from '../entities/user.entity';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';

@Injectable()
export class UserProfileHelper {
  /**
   * @summary 일정 알림을 보낼 수 있는지 확인하는 함수
   * @author  Jason
   * @param   { UserAlarmSettingDto | UserAlarmSettingEntity } userAlarmSettings
   * @returns { boolean }
   */
  checkCanSendScheduleAlarm(
    userAlarmSettings?: UserAlarmSettingDto | UserAlarmSettingEntity,
  ): boolean {
    return (
      isDefined(userAlarmSettings) &&
      userAlarmSettings.isTotalAlarm === ECheckColumn.ACTIVE &&
      userAlarmSettings.isScheduleReminderAlarm === ECheckColumn.ACTIVE
    );
  }

  /**
   * @summary 프로필 이미지 수정 API -> parameter 설정하는 함수
   * @author  Jason
   * @param   { Express.MulterS3.File } imageFile
   * @returns { UserEntity }
   */
  setUpdateProfileImageParam(imageFile?: Express.MulterS3.File): UserEntity {
    const user = new UserEntity();

    user.profileImageUrl = imageFile?.location ?? USER_DEFAULT_PROFILE_IMAGE;
    user.profileImageKey = imageFile?.key ?? null;

    return user;
  }
}
