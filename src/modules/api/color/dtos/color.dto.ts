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

  static ofByArray(colors: ColorEntity[]): ColorDto[] {
    return colors.map(
      (color) => new ColorDto(color.id, color.name, color.code),
    );
  }

  static ofByValue(color: ColorEntity): ColorDto {
    return new ColorDto(color.id, color.name, color.code);
  }

  get getCode(): string {
    return this.code;
  }
}
