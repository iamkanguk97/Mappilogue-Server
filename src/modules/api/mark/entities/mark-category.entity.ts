import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MARK_CATEGORY_TITLE_LENGTH } from '../variables/constants/mark-category.constant';
import { ECheckColumn, EStatusOrCheckColumnLength } from 'src/constants/enum';
import { MarkEntity } from './mark.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('MarkCategory')
export class MarkCategoryEntity extends CommonEntity {
  @Column('int')
  userId!: number;

  @Column('varchar', { length: MARK_CATEGORY_TITLE_LENGTH })
  title!: string;

  @Column('int')
  sequence!: number;

  @Column('varchar', {
    length: EStatusOrCheckColumnLength.STATUS,
    default: ECheckColumn.ACTIVE,
  })
  isMarkedInMap!: ECheckColumn;

  @ManyToOne(() => UserEntity, (user) => user.markCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  @OneToMany(() => MarkEntity, (marks) => marks.markCategory, {
    cascade: false,
  })
  marks?: MarkEntity[];

  static from(
    userId: number,
    title: string,
    sequence: number,
    isMarkedInMap?: ECheckColumn,
  ): MarkCategoryEntity {
    const markCategory = new MarkCategoryEntity();

    markCategory.userId = userId;
    markCategory.title = title;
    markCategory.sequence = sequence;
    markCategory.isMarkedInMap = isMarkedInMap ?? ECheckColumn.ACTIVE;

    return markCategory;
  }
}
