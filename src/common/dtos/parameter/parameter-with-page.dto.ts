import { PageOptionsDto } from '../pagination/page-options.dto';

export class ParameterWithPageDto<T> {
  private readonly _userId!: number;
  private readonly _parameter!: T;
  private readonly _pageOptionsDto!: PageOptionsDto;

  private constructor(
    userId: number,
    parameter: T,
    pageOptionsDto: PageOptionsDto,
  ) {
    this._userId = userId;
    this._parameter = parameter;
    this._pageOptionsDto = pageOptionsDto;
  }

  static from<T>(
    userId: number,
    parameter: T,
    pageOptionsDto: PageOptionsDto,
  ): ParameterWithPageDto<T> {
    return new ParameterWithPageDto(userId, parameter, pageOptionsDto);
  }

  get userId(): number {
    return this._userId;
  }

  get pageOptionsDto(): PageOptionsDto {
    return this._pageOptionsDto;
  }

  get parameter(): T {
    return this._parameter;
  }
}
