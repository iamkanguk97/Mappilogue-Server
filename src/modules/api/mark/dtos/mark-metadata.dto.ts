import { Exclude, Expose } from 'class-transformer';
import { CheckColumnEnum } from 'src/constants/enum';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

export class MarkMetadataDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _markId: number;
  @Exclude() private readonly _markImageUrl: string;
  @Exclude() private readonly _isMainImage: CheckColumnEnum;
  @Exclude() private readonly _caption: string | null;
  @Exclude() private readonly _markImageKey: string | null;

  private constructor(
    id: number,
    markId: number,
    markImageUrl: string,
    isMainImage: CheckColumnEnum,
    caption: string | null,
    markImageKey: string | null,
  ) {
    this._id = id;
    this._markId = markId;
    this._markImageKey = markImageKey;
    this._markImageUrl = markImageUrl;
    this._caption = caption;
    this._isMainImage = isMainImage;
  }

  static of(markMetadata: MarkMetadataEntity): MarkMetadataDto {
    return new MarkMetadataDto(
      markMetadata.id,
      markMetadata.markId,
      markMetadata.markImageUrl,
      markMetadata.isMainImage,
      markMetadata.caption,
      markMetadata.markImageKey,
    );
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get markId(): number {
    return this._markId;
  }

  @Expose()
  get markImageUrl(): string {
    return this._markImageUrl;
  }

  @Expose()
  get isMainImage(): CheckColumnEnum {
    return this._isMainImage;
  }

  @Expose()
  get caption(): string | null {
    return this._caption;
  }

  @Expose()
  get markImageKey(): string | null {
    return this._markImageKey;
  }
}
