import { Exclude, Expose } from 'class-transformer';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

interface asdf {
  id: number;
  title: string;
}

interface qwer {
  scheduleAreaId?: number | undefined;
  name: string;
  streetAddress: string;
  latitude: string;
  longitude: string;
}

interface date {
  createdAt: string;
  areaDate: string;
}

interface md {
  imageUrl: string;
  caption: string;
}

export class GetMarkDetailByIdResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _markCategory: asdf;
  @Exclude() private readonly _markMainLocation: MarkLocationEntity;
  @Exclude() private readonly _markDate: date;
  @Exclude() private readonly _content: string;
  @Exclude() private readonly _markMetadata: MarkMetadataEntity[];

  private constructor(
    id: number,
    markCategory: asdf,
    markMainLocation: MarkLocationEntity,
    markDate: date,
    content: string,
    markMetadata: MarkMetadataEntity[],
  ) {
    this._id = id;
    this._markCategory = markCategory;
    this._markMainLocation = markMainLocation;
    this._markDate = markDate;
    this._content = content;
    this._markMetadata = markMetadata;
  }

  static from(
    id: number,
    markCategory: asdf,
    markMainLocation: MarkLocationEntity,
    markDate: date,
    content: string,
    markMetadata: MarkMetadataEntity[],
  ) {
    return new GetMarkDetailByIdResponseDto(
      id,
      markCategory,
      markMainLocation,
      markDate,
      content,
      markMetadata,
    );
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get markCategory(): asdf {
    return this._markCategory;
  }

  @Expose()
  get markMainLocation(): MarkLocationEntity {
    return this._markMainLocation;
  }

  @Expose()
  get markDate(): date {
    return this._markDate;
  }

  @Expose()
  get content(): string {
    return this._content;
  }

  @Expose()
  get markMetadata(): MarkMetadataEntity[] {
    return this._markMetadata;
  }
}
