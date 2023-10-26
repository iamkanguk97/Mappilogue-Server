import { ColorEntity } from 'src/modules/api/color/entities/color.entity';
import { MarkCategoryEntity } from 'src/modules/api/mark/entities/mark-category.entity';
import { ScheduleAreaEntity } from 'src/modules/api/schedule/entities/schedule-area.entity';
import { ScheduleEntity } from 'src/modules/api/schedule/entities/schedule.entity';
import { UserAlarmHistoryEntity } from 'src/modules/api/user/entities/user-alarm-history.entity';
import { UserAlarmSettingEntity } from 'src/modules/api/user/entities/user-alarm-setting.entity';
import { UserWithdrawReasonEntity } from 'src/modules/api/user/entities/user-withdraw-reason.entity';
import { UserEntity } from 'src/modules/api/user/entities/user.entity';

export const DATABASE_MODELS = [
  ColorEntity,
  UserEntity,
  UserAlarmSettingEntity,
  UserAlarmHistoryEntity,
  UserWithdrawReasonEntity,
  ScheduleEntity,
  ScheduleAreaEntity,
  MarkCategoryEntity,
];
