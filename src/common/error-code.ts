export const CommonException = {
  MustStringType: {
    code: '8001',
    message: '문자열 타입으로 입력해주세요.',
  },
  MustCheckColumnType: {
    code: '8002',
    message: 'ACTIVE 또는 INACTIVE로 입력해주세요.',
  },
};

export const UserException = {
  SocialAccessTokenEmpty: {
    code: '0001',
    message: '소셜 Access-Token을 입력해주세요.',
  },
  SocialVendorEmpty: {
    code: '0002',
    message: '소셜 타입을 입력해주세요.',
  },
  SocialVendorErrorType: {
    code: '0003',
    message: '잘못된 소셜 타입입니다.',
  },
  RefreshTokenEmpty: {
    code: '0008',
    message: 'Refresh-Token을 입력해주세요.',
  },
};

export const ApiNotFoundException = {
  code: '7001',
  message: 'API NOT FOUND!',
};
