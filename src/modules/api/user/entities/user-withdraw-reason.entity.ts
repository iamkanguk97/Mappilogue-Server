import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  USER_EMAIL_LENGTH,
  USER_WITHDRAW_REASON_LENGTH,
} from '../constants/user.constant';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from './user.entity';

@Entity('UserWithdrawReason')
export class UserWithdrawReasonEntity extends CommonEntity {
  @Column('int')
  userId!: number;

  @Column('varchar', { length: USER_EMAIL_LENGTH })
  email!: string;

  @Column('varchar', { nullable: true, length: USER_WITHDRAW_REASON_LENGTH })
  reason?: string;

  @OneToOne(() => UserEntity, (user) => user.userWithdrawReason)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  static from(
    userId: number,
    email: string,
    reason?: string,
  ): UserWithdrawReasonEntity {
    const userWithdrawReason = new UserWithdrawReasonEntity();

    userWithdrawReason.userId = userId;
    userWithdrawReason.email = email;
    userWithdrawReason.reason = reason;

    return userWithdrawReason;
  }
}
