import { ColorEntity } from 'src/modules/api/color/entities/color.entity';
import { ScheduleAreaEntity } from 'src/modules/api/schedule/entities/schedule-area.entity';
import { ScheduleEntity } from 'src/modules/api/schedule/entities/schedule.entity';
import { UserAlarmSettingEntity } from 'src/modules/api/user/entities/user-alarm-setting.entity';
import { UserEntity } from 'src/modules/api/user/entities/user.entity';

export const DATABASE_MODELS = [
  ColorEntity,
  UserEntity,
  UserAlarmSettingEntity,
  ScheduleEntity,
  ScheduleAreaEntity,
];
