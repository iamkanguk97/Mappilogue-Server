import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  MarkLocationLatitudeLengthEnum,
  MarkLocationLongitudeLengthEnum,
  MarkLocationNameLengthEnum,
  MarkLocationStreetAddressLengthEnum,
} from '../constants/mark.enum';
import { MarkEntity } from './mark.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('MarkLocation')
export class MarkLocationEntity extends CommonEntity {
  @Column('int')
  markId: number;

  @Column('int', { nullable: true })
  scheduleAreaId?: number | undefined;

  @Column('varchar', { nullable: true, length: MarkLocationNameLengthEnum.MAX })
  name?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: MarkLocationStreetAddressLengthEnum.MAX,
  })
  streetAddress?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: MarkLocationLatitudeLengthEnum.MAX,
  })
  latitude?: string | undefined;

  @Column('varchar', {
    nullable: true,
    length: MarkLocationLongitudeLengthEnum.MAX,
  })
  longitude?: string | undefined;

  @OneToOne(() => MarkEntity, (mark) => mark.markLocation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'markId', referencedColumnName: 'id' })
  mark: MarkEntity;

  static from(
    markId: number,
    scheduleAreaId?: number | undefined,
    name?: string | undefined,
    streetAddress?: string | undefined,
    latitude?: string | undefined,
    longitude?: string | undefined,
  ): MarkLocationEntity {
    const markLocation = new MarkLocationEntity();

    markLocation.markId = markId;
    markLocation.scheduleAreaId = scheduleAreaId;
    markLocation.name = name;
    markLocation.streetAddress = streetAddress;
    markLocation.latitude = latitude;
    markLocation.longitude = longitude;

    return markLocation;
  }
}
