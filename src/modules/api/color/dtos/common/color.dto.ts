import { ColorEntity } from '../../entities/color.entity';
import { Exclude, Expose } from 'class-transformer';

export class ColorDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _code: string;

  private constructor(id: number, name: string, code: string) {
    this._id = id;
    this._name = name;
    this._code = code;
  }

  static of(color: ColorEntity): ColorDto {
    return new ColorDto(color.id, color.name, color.code);
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  @Expose()
  get code(): string {
    return this._code;
  }
}
