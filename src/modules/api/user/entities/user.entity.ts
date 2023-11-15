import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm';
import { UserGenderEnum, UserSnsTypeEnum } from '../constants/user.enum';
import { UserAlarmSettingEntity } from './user-alarm-setting.entity';
import {
  USER_AGE_LENGTH,
  USER_BIRTHDAY_LENGTH,
  USER_EMAIL_LENGTH,
  USER_GENDER_LENGTH,
  USER_NICKNAME_LENGTH,
  USER_PROFILE_IMAGE_KEY_LENGTH,
  USER_SNS_ID_LENGTH,
  USER_SNS_TYPE_LENGTH,
} from '../constants/user.constant';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import { MarkEntity } from '../../mark/entities/mark.entity';
import { CommonEntity } from 'src/entities/common/common.entity';

@Entity('User')
@Unique(['email', 'profileImageKey', 'snsId'])
export class UserEntity extends CommonEntity {
  @Column('varchar', { length: USER_NICKNAME_LENGTH })
  nickname: string;

  @Column('varchar', { length: USER_EMAIL_LENGTH })
  email: string;

  @Column('text')
  profileImageUrl: string;

  @Column('varchar', {
    nullable: true,
    length: USER_PROFILE_IMAGE_KEY_LENGTH,
  })
  profileImageKey?: string | undefined;

  @Column('varchar', { nullable: true, length: USER_GENDER_LENGTH })
  gender?: UserGenderEnum | undefined;

  @Column('varchar', { nullable: true, length: USER_AGE_LENGTH })
  age?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: USER_BIRTHDAY_LENGTH,
  })
  birthday?: string | undefined;

  @Column('varchar', {
    length: USER_SNS_ID_LENGTH,
  })
  snsId: string;

  @Column('varchar', {
    length: USER_SNS_TYPE_LENGTH,
  })
  snsType!: UserSnsTypeEnum;

  @Column('varchar', { nullable: true })
  fcmToken?: string | undefined;

  @OneToOne(
    () => UserAlarmSettingEntity,
    (userAlarmSetting) => userAlarmSetting.user,
    { cascade: true },
  )
  userAlarmSetting: UserAlarmSettingEntity;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.user, {
    cascade: true,
  })
  schedules: ScheduleEntity[];

  @OneToMany(() => MarkCategoryEntity, (markCategory) => markCategory.user, {
    cascade: true,
  })
  markCategories: MarkCategoryEntity[];

  @OneToMany(() => MarkEntity, (marks) => marks.userId, { cascade: true })
  marks: MarkEntity[];
}
