import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EStatusColumn, EStatusOrCheckColumnLength } from 'src/constants/enum';

/**
 * @deprecated 2023-11-16 Deprecated 처리
 * - soft delete로 바꾸면서 status value 필요x
 * - CommonEntity로 대체
 */
export class DefaultColumnType {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id!: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;

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
    default: EStatusColumn.ACTIVE,
    length: EStatusOrCheckColumnLength.STATUS,
  })
  status!: EStatusColumn;
}
