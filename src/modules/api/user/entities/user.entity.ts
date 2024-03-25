import { Column, Entity, Index, OneToMany, OneToOne, Unique } from 'typeorm';
import { EUserGender, EUserSnsType } from '../variables/enums/user.enum';
import { UserAlarmSettingEntity } from './user-alarm-setting.entity';
import {
  USER_AGE_LENGTH,
  USER_APPLE_REFRESH_TOKEN_LENGTH,
  USER_BIRTHDAY_LENGTH,
  USER_EMAIL_LENGTH,
  USER_FCM_TOKEN_LENGTH,
  USER_GENDER_LENGTH,
  USER_NICKNAME_LENGTH,
  USER_PROFILE_IMAGE_KEY_LENGTH,
  USER_SNS_ID_LENGTH,
  USER_SNS_TYPE_LENGTH,
} from '../variables/constants/user.constant';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';
import { MarkCategoryEntity } from '../../mark/entities/mark-category.entity';
import { MarkEntity } from '../../mark/entities/mark.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserWithdrawReasonEntity } from './user-withdraw-reason.entity';
import { ECheckColumn, EStatusOrCheckColumnLength } from 'src/constants/enum';

@Entity('User')
@Index(['email', 'snsId'])
@Unique(['profileImageKey', 'snsId'])
export class UserEntity extends CommonEntity {
  @Column('varchar', { length: USER_NICKNAME_LENGTH })
  nickname!: string;

  @Column('varchar', { nullable: true, length: USER_EMAIL_LENGTH })
  email!: string | null;

  @Column('text')
  profileImageUrl!: string;

  @Column('varchar', {
    nullable: true,
    length: USER_PROFILE_IMAGE_KEY_LENGTH,
  })
  profileImageKey!: string | null;

  @Column('varchar', { nullable: true, length: USER_GENDER_LENGTH })
  gender!: EUserGender | null;

  @Column('varchar', { nullable: true, length: USER_AGE_LENGTH })
  age!: string | null;

  @Column('varchar', {
    length: USER_BIRTHDAY_LENGTH,
  })
  birthday!: string;

  @Column('varchar', {
    length: USER_SNS_ID_LENGTH,
  })
  snsId!: string;

  @Column('varchar', {
    length: USER_SNS_TYPE_LENGTH,
  })
  snsType!: EUserSnsType;

  @Column('varchar', { nullable: true, length: USER_FCM_TOKEN_LENGTH })
  fcmToken!: string | null;

  @Column('varchar', {
    nullable: true,
    length: USER_APPLE_REFRESH_TOKEN_LENGTH,
  })
  appleRefreshToken!: string | null;

  @Column('varchar', { length: EStatusOrCheckColumnLength.CHECK })
  isMarketingConsentGiven!: ECheckColumn;

  @OneToOne(
    () => UserAlarmSettingEntity,
    (userAlarmSetting) => userAlarmSetting.user,
    { cascade: true },
  )
  userAlarmSetting?: UserAlarmSettingEntity;

  @OneToOne(
    () => UserWithdrawReasonEntity,
    (userWithdrawReason) => userWithdrawReason.user,
    { cascade: false },
  )
  userWithdrawReason?: UserWithdrawReasonEntity;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.user, {
    cascade: true,
  })
  schedules?: ScheduleEntity[];

  @OneToMany(() => MarkCategoryEntity, (markCategory) => markCategory.user, {
    cascade: true,
  })
  markCategories?: MarkCategoryEntity[];

  @OneToMany(() => MarkEntity, (marks) => marks.user, { cascade: true })
  marks?: MarkEntity[];
}
