import { UserEntity } from '../entities/user.entity';

// 카카오 소셜 데이터 처리 후 타입
export type TProcessedSocialKakaoInfo = Pick<
  UserEntity,
  | 'snsId'
  | 'snsType'
  | 'nickname'
  | 'email'
  | 'profileImageUrl'
  | 'age'
  | 'gender'
  | 'birthday'
>;

// Access-Token Decode 후 Payload Type
export type TDecodedUserToken = Pick<
  UserEntity,
  | 'id'
  | 'email'
  | 'nickname'
  | 'profileImageUrl'
  | 'profileImageKey'
  | 'snsType'
  | 'appleRefreshToken'
>;
