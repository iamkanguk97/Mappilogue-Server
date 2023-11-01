import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';

@Entity('MarkLocation')
export class MarkLocationEntity extends DefaultColumnType {
  @Column('int')
  markId: number;

  @Column('int', { nullable: true })
  scheduleAreaId?: number | undefined;

  @Column('varchar', { nullable: true, length: 30 })
  name?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: 100,
  })
  streetAddress?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: 100,
  })
  latitude?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: 100,
  })
  longitude?: string | undefined;
}
