import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';
import {
  UserEmailLength,
  UserNickNameLength,
  UserProfileImageKeyLength,
} from '../constants/user.constant';

@Entity('User')
export class UserEntity extends DefaultColumnType {
  @Column('varchar', { length: UserNickNameLength.MAX })
  nickname: string;

  @Column('varchar', { length: UserEmailLength.MAX, unique: true })
  email: string;

  @Column('text', { nullable: true })
  profileImageUrl?: string | null;

  @Column('varchar', {
    nullable: true,
    length: UserProfileImageKeyLength.MAX,
  })
  profileImageKey?: string | null;

  @Column('varchar', { length: 10, nullable: true })
  gender?: string | null;

  @Column('varchar', { nullable: true })
  age?: string | null;

  @Column('varchar', {
    nullable: true,
  })
  birthday?: string | null;

  @Column('varchar', {
    nullable: true,
    length: 255,
  })
  snsId?: string | null;

  // @Column('varchar', { length: 10, comment: 'Social login type' })
  // snsType!: SnsLoginType;

  @Column('text', { nullable: true })
  fcmToken?: string | null;
}
