import { ColorEntity } from '../entities/color.entity';

export class ColorDto {
  private readonly id: number;
  private readonly name: string;
  private readonly code: string;

  constructor(id: number, name: string, code: string) {
    this.id = id;
    this.name = name;
    this.code = code;
  }

  static of(colors: ColorEntity[]): ColorDto[] {
    return colors.map(
      (color) => new ColorDto(color.id, color.name, color.code),
    );
  }
}
