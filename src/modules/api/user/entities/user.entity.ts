import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, OneToOne } from 'typeorm';
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

@Entity('User')
export class UserEntity extends DefaultColumnType {
  @Column('varchar', { length: USER_NICKNAME_LENGTH })
  nickname: string;

  @Column('varchar', { length: USER_EMAIL_LENGTH, unique: true })
  email: string;

  @Column('text', { nullable: true })
  profileImageUrl?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: USER_PROFILE_IMAGE_KEY_LENGTH,
  })
  profileImageKey?: string | undefined;

  @Column('varchar', { length: USER_GENDER_LENGTH, nullable: true })
  gender?: UserGenderEnum | undefined;

  @Column('varchar', { nullable: true, length: USER_AGE_LENGTH })
  age?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: USER_BIRTHDAY_LENGTH,
  })
  birthday?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: USER_SNS_ID_LENGTH,
    unique: true,
  })
  snsId?: string | undefined;

  @Column('varchar', {
    length: USER_SNS_TYPE_LENGTH,
  })
  snsType!: UserSnsTypeEnum;

  @Column('text', { nullable: true })
  fcmToken?: string | undefined;

  @OneToOne(
    () => UserAlarmSettingEntity,
    (userAlarmSetting) => userAlarmSetting.user,
    { cascade: true },
  )
  userAlarmSetting: UserAlarmSettingEntity;
}
