import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity('Announcement')
export class AnnouncementEntity extends CommonEntity {
  @Column('varchar', { length: 100 })
  title!: string;

  @Column('text')
  content!: string;
}
