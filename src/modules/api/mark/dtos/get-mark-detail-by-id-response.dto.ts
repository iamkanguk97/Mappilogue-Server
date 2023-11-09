import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

export class GetMarkDetailByIdResponseDto {
  private readonly markBaseInfo: any;
  private readonly markMetadata: MarkMetadataEntity[];

  constructor(markBaseInfo: any, markMetadata: MarkMetadataEntity[]) {
    this.markBaseInfo = markBaseInfo;
    this.markMetadata = markMetadata;
  }

  static from(
    markBaseInfo: any,
    markMetadata: MarkMetadataEntity[],
  ): GetMarkDetailByIdResponseDto {
    return new GetMarkDetailByIdResponseDto(markBaseInfo, markMetadata);
  }
}
