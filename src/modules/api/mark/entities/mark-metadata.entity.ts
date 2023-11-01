import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';

@Entity('MarkMetadata')
export class MarkMetadataEntity extends DefaultColumnType {
  @Column('int')
  markId: number;

  @Column('text')
  markImageUrl: string;

  @Column('tinytext', { nullable: true })
  caption?: string | undefined;

  @Column('varchar', { length: StatusOrCheckColumnLengthEnum.CHECK })
  isMainImage: CheckColumnEnum;
}
