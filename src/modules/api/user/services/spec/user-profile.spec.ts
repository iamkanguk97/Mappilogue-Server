import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileService } from '../user-profile.service';

describe('UserProfileService', () => {
  let userProfileService: UserProfileService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
    }).compile();

    userProfileService = module.get<UserProfileService>(UserProfileService);
  });

  it('UserProfileService 정의여부 확인', () => {
    return;
  });

  describe('UserProfileService - modifyUserNickname', () => {
    // 이전 사용자의 이름 저장
    // 메서드 호출해서 사용자의 이름 변경
    // 변했는지 확인
    return;
  });

  describe('UserProfileService - modifyUserProfileImage', () => {
    return;
  });

  describe('UserProfileService - modifyUserAlarmSetting', () => {
    return;
  });
});
