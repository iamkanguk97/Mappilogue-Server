import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MarkCategoryEntity } from './mark-category.entity';
import { MarkTitleLengthEnum } from '../variables/enums/mark.enum';
import { CommonEntity } from 'src/common/entities/common.entity';
import { MarkLocationEntity } from './mark-location.entity';
import { MarkMetadataEntity } from './mark-metadata.entity';

@Entity('Mark')
export class MarkEntity extends CommonEntity {
  @Column('int')
  userId!: number;

  @Column('int')
  colorId!: number;

  @Column('int', { nullable: true })
  markCategoryId!: number | null;

  @Column('int', { nullable: true })
  scheduleId!: number | null;

  @Column('varchar', { length: MarkTitleLengthEnum.MAX })
  title!: string;

  @Column('tinytext', { nullable: true })
  content!: string | null;

  @ManyToOne(() => UserEntity, (user) => user.marks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => MarkCategoryEntity, (markCategory) => markCategory.marks, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'markCategoryId', referencedColumnName: 'id' })
  markCategory?: MarkCategoryEntity;

  @OneToOne(() => MarkLocationEntity, (markLocation) => markLocation.mark, {
    cascade: true,
  })
  markLocation?: MarkLocationEntity;

  @OneToMany(() => MarkMetadataEntity, (markMetadata) => markMetadata.marks, {
    cascade: true,
  })
  markMetadata?: MarkMetadataEntity[];

  static from(
    userId: number,
    title: string,
    colorId: number,
    markCategoryId: number | null,
    scheduleId: number | null,
    content: string | null,
  ): MarkEntity {
    const mark = new MarkEntity();

    mark.userId = userId;
    mark.title = title;
    mark.colorId = colorId;
    mark.markCategoryId = markCategoryId;
    mark.scheduleId = scheduleId;
    mark.content = content;

    return mark;
  }
}
