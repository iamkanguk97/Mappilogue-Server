import { TokenTypeEnum } from '../constants/auth.enum';

export interface JwtRefreshPayload {
  userId: number;
  iat: bigint;
  exp: bigint;
  sub: TokenTypeEnum;
}
