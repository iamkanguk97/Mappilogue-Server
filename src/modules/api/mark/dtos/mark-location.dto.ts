import { MarkLocationEntity } from '../entities/mark-location.entity';

export class MarkLocationDto {
  private readonly markId: number;
  private readonly scheduleAreaId: number | null;
  private readonly name?: string;
  private readonly streetAddress?: string;
  private readonly latitude?: string;
  private readonly longitude?: string;

  private constructor(
    markId: number,
    scheduleAreaId: number | null,
    name?: string,
    streetAddress?: string,
    latitude?: string,
    longitude?: string,
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
