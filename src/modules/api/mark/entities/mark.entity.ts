import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MarkCategoryEntity } from './mark-category.entity';
import { MarkTitleLengthEnum } from '../constants/mark.enum';

@Entity('Mark')
export class MarkEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('int', { nullable: true })
  markCategoryId?: number | undefined;

  @Column('int', { nullable: true })
  scheduleId?: number | undefined;

  @Column('varchar', { length: MarkTitleLengthEnum.MAX })
  title: string;

  @Column('tinytext', { nullable: true })
  content?: string | undefined;

  @ManyToOne(() => UserEntity, (user) => user.marks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => MarkCategoryEntity, (markCategory) => markCategory.marks, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'markCategoryId', referencedColumnName: 'id' })
  markCategory: MarkCategoryEntity;
}
