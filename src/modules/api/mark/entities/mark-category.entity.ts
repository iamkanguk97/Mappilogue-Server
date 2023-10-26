import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MARK_CATEGORY_TITLE_LENGTH } from '../../mark-category/constants/mark-category.constant';

@Entity('MarkCategory')
export class MarkCategoryEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('varchar', { length: MARK_CATEGORY_TITLE_LENGTH })
  title: string;

  @Column('int')
  sequence: number;

  @ManyToOne(() => UserEntity, (user) => user.markCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
