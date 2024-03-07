import { Exclude, Expose } from 'class-transformer';
import { MarkLocationEntity } from '../../entities/mark-location.entity';

export class MarkLocationDto {
  @Exclude() private readonly _markId: number;
  @Exclude() private readonly _scheduleAreaId: number | null;
  @Exclude() private readonly _name: string | null;
  @Exclude() private readonly _streetAddress: string | null;
  @Exclude() private readonly _latitude: string | null;
  @Exclude() private readonly _longitude: string | null;

  private constructor(
    markId: number,
    scheduleAreaId: number | null,
    name: string | null,
    streetAddress: string | null,
    latitude: string | null,
    longitude: string | null,
  ) {
    this._markId = markId;
    this._scheduleAreaId = scheduleAreaId;
    this._name = name;
    this._streetAddress = streetAddress;
    this._latitude = latitude;
    this._longitude = longitude;
  }

  static of(markLocation: MarkLocationEntity): MarkLocationDto {
    return new MarkLocationDto(
      markLocation.markId,
      markLocation.scheduleAreaId,
      markLocation.name,
      markLocation.streetAddress,
      markLocation.latitude,
      markLocation.longitude,
    );
  }

  @Expose()
  get markId(): number {
    return this._markId;
  }

  @Expose()
  get scheduleAreaId(): number | null {
    return this._scheduleAreaId;
  }

  @Expose()
  get name(): string | null {
    return this._name;
  }

  @Expose()
  get streetAddress(): string | null {
    return this._streetAddress;
  }

  @Expose()
  get latitude(): string | null {
    return this._latitude;
  }

  @Expose()
  get longitude(): string | null {
    return this._longitude;
  }
}
