import { Exclude, Expose } from 'class-transformer';
import { MarkMetadataDto } from '../common/mark-metadata.dto';
import { ISelectMarkByIdExceptMetadata } from '../../interfaces';
import { MarkCategoryDto } from '../common/mark-category.dto';
import { MarkDto } from '../common/mark.dto';
import { MarkLocationDto } from '../common/mark-location.dto';
import { MarkLocationEntity } from '../../entities/mark-location.entity';

type TGetMark = Pick<MarkDto, 'id' | 'title' | 'content'> & { date: string };
type TGetMarkCategory = Pick<MarkCategoryDto, 'id' | 'title'>;

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
  get mark(): TGetMark {
    return {
      id: this._markResult.id,
      title: this._markResult.title,
      content: this._markResult.content,
      date: this._markResult.markDate,
    } as TGetMark;
  }

  @Expose()
  get markCategory(): TGetMarkCategory {
    return {
      id: this._markResult.markCategoryId,
      title: this._markResult.markCategoryTitle,
    } as TGetMarkCategory;
  }

  @Expose()
  get markLocation(): MarkLocationDto {
    return MarkLocationDto.of(
      MarkLocationEntity.from(
        this._markResult.id,
        this._markResult.scheduleAreaId,
        this._markResult.name,
        this._markResult.streetAddress,
        this._markResult.latitude,
        this._markResult.longitude,
      ),
    );
  }

  @Expose()
  get markMetadata(): MarkMetadataDto[] {
    return this._markMetadataResult;
  }
}
