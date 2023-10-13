export class ColorDto {
  private readonly id: number;
  private readonly name: string;
  private readonly code: string;

  constructor(id: number, name: string, code: string) {
    this.id = id;
    this.name = name;
    this.code = code;
  }
}
