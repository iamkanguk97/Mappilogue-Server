import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';
import {
  USER_EMAIL_LENGTH,
  USER_WITHDRAW_REASON_LENGTH,
} from '../constants/user.constant';

@Entity('UserWithdrawReason')
export class UserWithdrawReasonEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('varchar', { length: USER_EMAIL_LENGTH })
  email: string;

  @Column('varchar', { nullable: true, length: USER_WITHDRAW_REASON_LENGTH })
  reason?: string | undefined;

  static from(
    userId: number,
    email: string,
    reason?: string | undefined,
  ): UserWithdrawReasonEntity {
    const userWithdrawReason = new UserWithdrawReasonEntity();

    userWithdrawReason.userId = userId;
    userWithdrawReason.email = email;
    userWithdrawReason.reason = reason;

    return userWithdrawReason;
  }
}
