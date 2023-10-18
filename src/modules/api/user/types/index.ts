import { UserEntity } from '../entities/user.entity';

export type ProcessedSocialKakaoInfo = Pick<
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

export type DecodedUserToken = Pick<
  UserEntity,
  | 'id'
  | 'email'
  | 'nickname'
  | 'profileImageUrl'
  | 'profileImageKey'
  | 'snsType'
>;
