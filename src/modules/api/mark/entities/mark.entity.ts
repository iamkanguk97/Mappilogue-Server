import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MarkCategoryEntity } from './mark-category.entity';

@Entity('Mark')
export class MarkEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('int', { nullable: true })
  markCategoryId: number;

  @Column('varchar', { length: 50 })
  title: string;

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
