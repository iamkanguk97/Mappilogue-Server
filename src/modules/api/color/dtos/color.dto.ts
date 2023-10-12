import { ColorEntity } from 'src/modules/api/color/entities/color.entity';

export class ColorDto {
  private readonly id: number;
  private readonly name: string;
  private readonly code: string;

  private constructor(id: number, name: string, code: string) {
    this.id = id;
    this.name = name;
    this.code = code;
  }

  static fromEntity(color: ColorEntity): ColorDto {
    return new ColorDto(color.id, color.name, color.code);
  }
}
