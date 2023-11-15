import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MARK_CATEGORY_TITLE_LENGTH } from '../../mark-category/constants/mark-category.constant';
import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { MarkEntity } from './mark.entity';
import { CommonEntity } from 'src/entities/common/common.entity';

@Entity('MarkCategory')
export class MarkCategoryEntity extends CommonEntity {
  @Column('int')
  userId: number;

  @Column('varchar', { length: MARK_CATEGORY_TITLE_LENGTH })
  title: string;

  @Column('int')
  sequence: number;

  @Column('varchar', {
    length: StatusOrCheckColumnLengthEnum.STATUS,
    default: CheckColumnEnum.ACTIVE,
  })
  isMarkedInMap: CheckColumnEnum;

  @ManyToOne(() => UserEntity, (user) => user.markCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => MarkEntity, (marks) => marks.markCategory, {
    cascade: false,
  })
  marks: MarkEntity[];

  static from(
    userId: number,
    title: string,
    sequence: number,
  ): MarkCategoryEntity {
    const markCategory = new MarkCategoryEntity();

    markCategory.userId = userId;
    markCategory.title = title;
    markCategory.sequence = sequence;

    return markCategory;
  }
}
