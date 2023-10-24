import {
  BaseEntity,
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
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    type: 'timestamp',
  })
  updatedAt?: Date | undefined;

  @DeleteDateColumn({
    nullable: true,
    type: 'timestamp',
  })
  deletedAt?: Date | undefined;

  @Column('varchar', {
    default: StatusColumnEnum.ACTIVE,
    length: StatusOrCheckColumnLengthEnum.STATUS,
  })
  status: StatusColumnEnum;
}
