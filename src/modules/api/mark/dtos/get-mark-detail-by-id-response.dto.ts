import { Exclude, Expose } from 'class-transformer';
import { MarkCategoryDto } from '../../mark-category/dtos/mark-category.dto';
import { MarkLocationDto } from './mark-location.dto';
import { MarkMetadataV2Dto } from './mark-metadata-v2.dto';

export class GetMarkDetailByIdResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _content: string;
  @Exclude() private readonly _markCategory: Partial<MarkCategoryDto>;
  @Exclude() private readonly _markMainLocation: MarkLocationDto;
  @Exclude() private readonly _markDate: {
    createdAt: string;
    areaDate: string;
  };
  @Exclude() private readonly _markMetadata: MarkMetadataV2Dto[];

  private constructor(
    id: number,
    content: string,
    markCategory: Partial<MarkCategoryDto>,
    markMainLocation: MarkLocationDto,
    markDate: { createdAt: string; areaDate: string },
    markMetadata: MarkMetadataV2Dto[],
  ) {
    this._id = id;
    this._content = content;
    this._markCategory = markCategory;
    this._markMainLocation = markMainLocation;
    this._markDate = markDate;
    this._markMetadata = markMetadata;
  }

  static from(
    id: number,
    content: string,
    markCategory: Partial<MarkCategoryDto>,
    markMainLocation: MarkLocationDto,
    markDate: { createdAt: string; areaDate: string },
    markMetadata: MarkMetadataV2Dto[],
  ): GetMarkDetailByIdResponseDto {
    return new GetMarkDetailByIdResponseDto(
      id,
      content,
      markCategory,
      markMainLocation,
      markDate,
      markMetadata,
    );
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get content(): string {
    return this._content;
  }

  @Expose()
  get markCategory(): Partial<MarkCategoryDto> {
    return this._markCategory;
  }

  @Expose()
  get markMainLocation(): MarkLocationDto {
    return this._markMainLocation;
  }

  @Expose()
  get markDate() {
    return this._markDate;
  }

  @Expose()
  get markMetadata(): MarkMetadataV2Dto[] {
    return this._markMetadata;
  }
}
