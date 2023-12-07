import { MarkMetadataEntity } from './../entities/mark-metadata.entity';
import { Exclude, Expose } from 'class-transformer';
import { CheckColumnEnum } from 'src/constants/enum';

export class MarkMetadataV2Dto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _markId: number;
  @Exclude() private readonly _markImageUrl: string;
  @Exclude() private readonly _caption: string;
  @Exclude() private readonly _isMainImage: CheckColumnEnum;

  constructor(
    id: number,
    markId: number,
    markImageUrl: string,
    caption: string,
    isMainImage: CheckColumnEnum,
  ) {
    this._id = id;
    this._markId = markId;
    this._markImageUrl = markImageUrl;
    this._caption = caption;
    this._isMainImage = isMainImage;
  }

  static of(markMetadata: MarkMetadataEntity): MarkMetadataV2Dto {
    return new MarkMetadataV2Dto(
      markMetadata.id,
      markMetadata.markId,
      markMetadata.markImageUrl,
      markMetadata.caption,
      markMetadata.isMainImage,
    );
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  // @Expose()
  // get markId(): number {
  //   return this._markId;
  // }

  @Expose()
  get markImageUrl(): string {
    return this._markImageUrl;
  }

  @Expose()
  get caption(): string {
    return this._caption;
  }

  @Expose()
  get isMainImage(): CheckColumnEnum {
    return this._isMainImage;
  }
}
