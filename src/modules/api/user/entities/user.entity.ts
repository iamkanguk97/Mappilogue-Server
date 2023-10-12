import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';
import {
  UserEmailLengthEnum,
  UserGenderEnum,
  UserNickNameLengthEnum,
  UserProfileImageKeyLengthEnum,
  UserSnsIdLengthEnum,
  UserSnsTypeEnum,
  UserSnsTypeLengthEnum,
} from '../constants/user.enum';

@Entity('User')
export class UserEntity extends DefaultColumnType {
  @Column('varchar', { length: UserNickNameLengthEnum.MAX })
  nickname: string;

  @Column('varchar', { length: UserEmailLengthEnum.MAX, unique: true })
  email: string;

  @Column('text', { nullable: true })
  profileImageUrl?: string | null;

  @Column('varchar', {
    nullable: true,
    length: UserProfileImageKeyLengthEnum.MAX,
  })
  profileImageKey?: string | null;

  @Column('varchar', { length: 10, nullable: true })
  gender?: UserGenderEnum | null;

  @Column('varchar', { nullable: true })
  age?: string | null;

  @Column('varchar', {
    nullable: true,
  })
  birthday?: string | null;

  @Column('varchar', {
    nullable: true,
    length: UserSnsIdLengthEnum.MAX,
    unique: true,
  })
  snsId?: string | null;

  @Column('varchar', {
    length: UserSnsTypeLengthEnum.MAX,
  })
  snsType!: UserSnsTypeEnum;

  @Column('text', { nullable: true })
  fcmToken?: string | null;
}
