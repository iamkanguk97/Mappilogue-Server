import { Exclude, Expose } from 'class-transformer';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

export class GetMarkDetailByIdResponseDto {
  @Exclude() private readonly _markBaseInfo: any;
  @Exclude() private readonly _markMetadata: MarkMetadataEntity[];

  private constructor(markBaseInfo: any, markMetadata: MarkMetadataEntity[]) {
    this._markBaseInfo = markBaseInfo;
    this._markMetadata = markMetadata;
  }

  static from(
    markBaseInfo: any,
    markMetadata: MarkMetadataEntity[],
  ): GetMarkDetailByIdResponseDto {
    return new GetMarkDetailByIdResponseDto(markBaseInfo, markMetadata);
  }

  @Expose()
  get markBaseInfo() {
    return this._markBaseInfo;
  }

  @Expose()
  get markMetadata() {
    return this._markMetadata;
  }
}
