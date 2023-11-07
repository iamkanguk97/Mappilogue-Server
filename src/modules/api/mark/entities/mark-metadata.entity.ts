import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { DefaultColumnType } from 'src/types/default-column.type';
import { Column, Entity } from 'typeorm';
import { MARK_IMAGE_KEY_LENGTH } from '../constants/mark.constant';

@Entity('MarkMetadata')
export class MarkMetadataEntity extends DefaultColumnType {
  @Column('int')
  markId: number;

  @Column('text')
  markImageUrl: string;

  @Column('varchar', { nullable: true, length: MARK_IMAGE_KEY_LENGTH })
  markImageKey?: string | undefined;

  @Column('tinytext', { nullable: true })
  caption?: string | undefined;

  @Column('varchar', { length: StatusOrCheckColumnLengthEnum.CHECK })
  isMainImage: CheckColumnEnum;

  static from(
    markId: number,
    markImageUrl: string,
    isMainImage: CheckColumnEnum,
    markImageKey?: string | undefined,
    caption?: string | undefined,
  ): MarkMetadataEntity {
    const markMetadata = new MarkMetadataEntity();

    markMetadata.markId = markId;
    markMetadata.markImageUrl = markImageUrl;
    markMetadata.isMainImage = isMainImage;
    markMetadata.markImageKey = markImageKey;
    markMetadata.caption = caption;

    return markMetadata;
  }
}
