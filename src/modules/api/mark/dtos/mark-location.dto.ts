import { MarkLocationEntity } from '../entities/mark-location.entity';

export class MarkLocationDto {
  private readonly markId: number;
  private readonly scheduleAreaId?: number | undefined;
  private readonly name?: string | undefined;
  private readonly streetAddress?: string | undefined;
  private readonly latitude?: string | undefined;
  private readonly longitude?: string | undefined;

  private constructor(
    markId: number,
    scheduleAreaId?: number | undefined,
    name?: string | undefined,
    streetAddress?: string | undefined,
    latitude?: string | undefined,
    longitude?: string | undefined,
  ) {
    this.markId = markId;
    this.scheduleAreaId = scheduleAreaId;
    this.name = name;
    this.streetAddress = streetAddress;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static of(markLocation: MarkLocationEntity): MarkLocationDto {
    return new MarkLocationDto(
      markLocation.markId,
      markLocation.scheduleAreaId,
      markLocation.name ?? '',
      markLocation.streetAddress ?? '',
      markLocation.latitude ?? '',
      markLocation.longitude ?? '',
    );
  }
}
