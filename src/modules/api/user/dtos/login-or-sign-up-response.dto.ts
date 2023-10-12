import { LoginOrSignUpEnum } from '../constants/user.enum';

export class LoginOrSignUpResponseDto {
  private readonly loginUserId: number;
  private readonly type: LoginOrSignUpEnum;
  private readonly tokens: any;

  constructor(loginUserId: number, type: LoginOrSignUpEnum, tokens: any) {
    this.loginUserId = loginUserId;
    this.type = type;
    this.tokens = tokens;
  }

  // static of() {
  //   return {
  //     loginUserId: this.loginUserId,
  //     type: this.type,
  //     accessToken: this.tokens.accessToken,
  //     refreshToken: this.tokens.refreshToken,
  //   };
  // }
}
