import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  StatusColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';

export class DefaultColumnType {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt?: Date | undefined;

  @Column('varchar', {
    default: StatusColumnEnum.ACTIVE,
    length: StatusOrCheckColumnLengthEnum.STATUS,
  })
  status: StatusColumnEnum;
}
