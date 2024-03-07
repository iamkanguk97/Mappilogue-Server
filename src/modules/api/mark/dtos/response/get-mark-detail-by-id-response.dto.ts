import { Exclude, Expose } from 'class-transformer';
import { MarkMetadataDto } from '../common/mark-metadata.dto';
import { ISelectMarkByIdExceptMetadata } from '../../interfaces';
import { MarkCategoryDto } from '../common/mark-category.dto';
import { MarkDto } from '../common/mark.dto';

export class GetMarkDetailByIdResponseDto {
  @Exclude() private readonly _markResult: ISelectMarkByIdExceptMetadata;
  @Exclude() private readonly _markMetadataResult: MarkMetadataDto[];

  private constructor(
    markResult: ISelectMarkByIdExceptMetadata,
    markMetadataResult: MarkMetadataDto[],
  ) {
    this._markResult = markResult;
    this._markMetadataResult = markMetadataResult;
  }

  static from(
    markResult: ISelectMarkByIdExceptMetadata,
    markMetadataResult: MarkMetadataDto[],
  ): GetMarkDetailByIdResponseDto {
    return new GetMarkDetailByIdResponseDto(markResult, markMetadataResult);
  }

  @Expose()
  get mark(): Pick<MarkDto, 'id' | 'title' | 'content'> {
    return {
      id: this._markResult.id,
      title: this._markResult.title,
      content: this._markResult.content,
      date: this._markResult.markDate,
    } as Pick<MarkDto, 'id' | 'title' | 'content'> & { date: string };
  }

  @Expose()
  get markCategory(): Pick<MarkCategoryDto, 'id' | 'title'> {
    return {
      id: this._markResult.markCategoryId,
      title: this._markResult.markCategoryTitle,
    } as Pick<MarkCategoryDto, 'id' | 'title'>;
  }

  @Expose()
  get markLocation() {
    return;
  }

  @Expose()
  get markMetadata(): MarkMetadataDto[] {
    return this._markMetadataResult;
  }

  // @Exclude() private readonly _id: number;
  // @Exclude() private readonly _content: string | null;
  // @Exclude() private readonly _markCategory: Partial<MarkCategoryDto>;
  // @Exclude() private readonly _markMainLocation: MarkLocationDto;
  // @Exclude() private readonly _markDate: string;
  // @Exclude() private readonly _markMetadata: MarkMetadataDto[];
  // private constructor(
  //   id: number,
  //   content: string | null,
  //   markCategory: Partial<MarkCategoryDto>,
  //   markMainLocation: MarkLocationDto,
  //   markDate: string,
  //   markMetadata: MarkMetadataDto[],
  // ) {
  //   this._id = id;
  //   this._content = content;
  //   this._markCategory = markCategory;
  //   this._markMainLocation = markMainLocation;
  //   this._markDate = markDate;
  //   this._markMetadata = markMetadata;
  // }
  // static from(
  //   id: number,
  //   content: string | null,
  //   markCategory: Partial<MarkCategoryDto>,
  //   markMainLocation: MarkLocationDto,
  //   markDate: string,
  //   markMetadata: MarkMetadataDto[],
  // ): GetMarkDetailByIdResponseDto {
  //   return new GetMarkDetailByIdResponseDto(
  //     id,
  //     content,
  //     markCategory,
  //     markMainLocation,
  //     markDate,
  //     markMetadata,
  //   );
  // }
  // @Expose()
  // get id(): number {
  //   return this._id;
  // }
  // @Expose()
  // get content(): string | null {
  //   return this._content;
  // }
  // @Expose()
  // get markCategory(): Partial<MarkCategoryDto> {
  //   return this._markCategory;
  // }
  // @Expose()
  // get markMainLocation(): MarkLocationDto {
  //   return this._markMainLocation;
  // }
  // @Expose()
  // get markDate(): string {
  //   return this._markDate;
  // }
  // @Expose()
  // get markMetadata(): MarkMetadataDto[] {
  //   return this._markMetadata;
  // }
}
