import { LoginOrSignUpEnum } from '../constants/user.enum';
import { TokenDto } from './token.dto';

export class LoginOrSignUpResponseDto {
  private readonly type: LoginOrSignUpEnum;
  private readonly loginUserId: number;
  private readonly accessToken: string;
  private readonly refreshToken: string;

  private constructor(
    type: LoginOrSignUpEnum,
    loginUserId: number,
    tokenDto: TokenDto,
  ) {
    this.loginUserId = loginUserId;
    this.type = type;
    this.accessToken = tokenDto.getAccessToken;
    this.refreshToken = tokenDto.getRefreshToken;
  }

  static from(
    type: LoginOrSignUpEnum,
    loginUserId: number,
    tokenDto: TokenDto,
  ): LoginOrSignUpResponseDto {
    return new LoginOrSignUpResponseDto(type, loginUserId, tokenDto);
  }
}
