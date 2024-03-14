export class ParameterDto<T> {
  private readonly _userId!: number;
  private readonly _parameter?: T;

  private constructor(userId: number, parameter?: T) {
    this._userId = userId;
    this._parameter = parameter;
  }

  static from<T>(userId: number, parameter?: T): ParameterDto<T> {
    return new ParameterDto(userId, parameter);
  }

  get userId(): number {
    return this._userId;
  }

  get parameter(): T | undefined {
    return this._parameter;
  }
}
