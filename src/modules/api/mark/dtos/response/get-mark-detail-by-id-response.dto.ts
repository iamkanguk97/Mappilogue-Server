import { Exclude, Expose } from 'class-transformer';
import { MarkCategoryDto } from '../mark-category.dto';
import { MarkLocationDto } from '../mark-location.dto';
import { MarkMetadataDto } from '../mark-metadata.dto';

export class GetMarkDetailByIdResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _content: string | null;
  @Exclude() private readonly _markCategory: Partial<MarkCategoryDto>;
  @Exclude() private readonly _markMainLocation: MarkLocationDto;
  @Exclude() private readonly _markDate: string;
  @Exclude() private readonly _markMetadata: MarkMetadataDto[];

  private constructor(
    id: number,
    content: string | null,
    markCategory: Partial<MarkCategoryDto>,
    markMainLocation: MarkLocationDto,
    markDate: string,
    markMetadata: MarkMetadataDto[],
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
    content: string | null,
    markCategory: Partial<MarkCategoryDto>,
    markMainLocation: MarkLocationDto,
    markDate: string,
    markMetadata: MarkMetadataDto[],
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
  get content(): string | null {
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
  get markDate(): string {
    return this._markDate;
  }

  @Expose()
  get markMetadata(): MarkMetadataDto[] {
    return this._markMetadata;
  }
}
