import {
  CheckColumnEnum,
  StatusOrCheckColumnLengthEnum,
} from 'src/constants/enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MARK_IMAGE_KEY_LENGTH } from '../constants/mark.constant';
import { CommonEntity } from 'src/common/entities/common.entity';
import { MarkEntity } from './mark.entity';

@Entity('MarkMetadata')
export class MarkMetadataEntity extends CommonEntity {
  @Column('int')
  markId!: number;

  @Column('text')
  markImageUrl!: string;

  @Column('varchar', { nullable: true, length: MARK_IMAGE_KEY_LENGTH })
  markImageKey!: string | null;

  @Column('tinytext', { nullable: true })
  caption!: string | null;

  @Column('varchar', { length: StatusOrCheckColumnLengthEnum.CHECK })
  isMainImage!: CheckColumnEnum;

  @ManyToOne(() => MarkEntity, (mark) => mark.markMetadata, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'markId', referencedColumnName: 'id' })
  marks?: MarkEntity;

  static from(
    markId: number,
    markImageUrl: string,
    isMainImage: CheckColumnEnum,
    markImageKey?: string,
    caption?: string,
  ): MarkMetadataEntity {
    const markMetadata = new MarkMetadataEntity();

    markMetadata.markId = markId;
    markMetadata.markImageUrl = markImageUrl;
    markMetadata.isMainImage = isMainImage;
    markMetadata.markImageKey = markImageKey ?? '';
    markMetadata.caption = caption ?? '';

    return markMetadata;
  }
}
