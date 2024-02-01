import { Exclude, Expose } from 'class-transformer';
import { LoginOrSignUpEnum } from '../constants/user.enum';
import { TokenDto } from './token.dto';

export class PostLoginOrSignUpResponseDto {
  @Exclude() private readonly _type: LoginOrSignUpEnum;
  @Exclude() private readonly _loginUserId: number;
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _refreshToken: string;

  private constructor(
    type: LoginOrSignUpEnum,
    loginUserId: number,
    tokenDto: TokenDto,
  ) {
    this._loginUserId = loginUserId;
    this._type = type;
    this._accessToken = tokenDto.accessToken;
    this._refreshToken = tokenDto.refreshToken;
  }

  static from(
    type: LoginOrSignUpEnum,
    loginUserId: number,
    tokenDto: TokenDto,
  ): PostLoginOrSignUpResponseDto {
    return new PostLoginOrSignUpResponseDto(type, loginUserId, tokenDto);
  }

  @Expose()
  get type(): LoginOrSignUpEnum {
    return this._type;
  }

  @Expose()
  get loginUserId(): number {
    return this._loginUserId;
  }

  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @Expose()
  get refreshToken(): string {
    return this._refreshToken;
  }
}
