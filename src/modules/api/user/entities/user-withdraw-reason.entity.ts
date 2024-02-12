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

  @Column('varchar', { nullable: true, length: USER_EMAIL_LENGTH })
  email!: string | null;

  @Column('varchar', { nullable: true, length: USER_WITHDRAW_REASON_LENGTH })
  reason!: string | null;

  @OneToOne(() => UserEntity, (user) => user.userWithdrawReason)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  static from(
    userId: number,
    email: string | null,
    reason: string | null,
  ): UserWithdrawReasonEntity {
    const userWithdrawReason = new UserWithdrawReasonEntity();

    userWithdrawReason.userId = userId;
    userWithdrawReason.email = email;
    userWithdrawReason.reason = reason;

    return userWithdrawReason;
  }
}
