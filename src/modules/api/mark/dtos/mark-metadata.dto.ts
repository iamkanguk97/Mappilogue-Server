import { CheckColumnEnum } from 'src/constants/enum';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

export class MarkMetadataDto {
  private readonly id: number;
  private readonly markId: number;
  private readonly markImageKey: string;
  private readonly markImageUrl: string;
  private readonly caption: string;
  private readonly isMainImage: CheckColumnEnum;

  private constructor(
    id: number,
    markId: number,
    markImageKey: string,
    markImageUrl: string,
    caption: string,
    isMainImage: CheckColumnEnum,
  ) {
    this.id = id;
    this.markId = markId;
    this.markImageKey = markImageKey;
    this.markImageUrl = markImageUrl;
    this.caption = caption;
    this.isMainImage = isMainImage;
  }

  static of(markMetadata: MarkMetadataEntity): MarkMetadataDto {
    return new MarkMetadataDto(
      markMetadata.id,
      markMetadata.markId,
      markMetadata.markImageKey,
      markMetadata.markImageUrl,
      markMetadata.caption,
      markMetadata.isMainImage,
    );
  }
}
