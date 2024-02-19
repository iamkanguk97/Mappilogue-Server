import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  MarkLocationLatitudeLengthEnum,
  MarkLocationLongitudeLengthEnum,
  MarkLocationNameLengthEnum,
  MarkLocationStreetAddressLengthEnum,
} from '../constants/enums/mark.enum';
import { MarkEntity } from './mark.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('MarkLocation')
export class MarkLocationEntity extends CommonEntity {
  @Column('int')
  markId!: number;

  @Column('int', { nullable: true })
  scheduleAreaId!: number | null;

  @Column('varchar', { nullable: true, length: MarkLocationNameLengthEnum.MAX })
  name!: string | null;

  @Column('varchar', {
    nullable: true,
    length: MarkLocationStreetAddressLengthEnum.MAX,
  })
  streetAddress!: string | null;

  @Column('varchar', {
    nullable: true,
    length: MarkLocationLatitudeLengthEnum.MAX,
  })
  latitude!: string | null;

  @Column('varchar', {
    nullable: true,
    length: MarkLocationLongitudeLengthEnum.MAX,
  })
  longitude!: string | null;

  @OneToOne(() => MarkEntity, (mark) => mark.markLocation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'markId', referencedColumnName: 'id' })
  mark?: MarkEntity;

  static from(
    markId: number,
    scheduleAreaId: number | null,
    name?: string | null,
    streetAddress?: string | null,
    latitude?: string | null,
    longitude?: string | null,
  ): MarkLocationEntity {
    const markLocation = new MarkLocationEntity();

    markLocation.markId = markId;
    markLocation.scheduleAreaId = scheduleAreaId;
    markLocation.name = name ?? null;
    markLocation.streetAddress = streetAddress ?? null;
    markLocation.latitude = latitude ?? null;
    markLocation.longitude = longitude ?? null;

    return markLocation;
  }
}
