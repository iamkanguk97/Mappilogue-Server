import { Request } from 'express';
import { DecodedUserToken } from 'src/modules/api/user/types';

// Request에 user를 넣을 때 custom-type을 지정해주는 인터페이스
export interface IRequestWithUserType extends Request {
  user: DecodedUserToken;
}
