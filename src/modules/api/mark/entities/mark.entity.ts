import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('Mark')
export class MarkEntity extends DefaultColumnType {
  @Column('int')
  userId: number;

  @Column('int')
  markCategoryId: number;

  @Column('varchar', { length: 50 })
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.marks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
