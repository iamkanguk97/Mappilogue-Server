import { MarkService } from '../mark.service';
import { MarkRepository } from '../../repositories/mark.repository';
import { Test } from '@nestjs/testing';
import { MarkCategoryService } from '../mark-category.service';
import { PostMarkCategoryRequestDto } from '../../dtos/request/post-mark-category-request.dto';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkCategoryRepository } from '../../repositories/mark-category.repository';
import { CoreModule } from 'src/modules/core/core.module';
import { MarkMetadataRepository } from '../../repositories/mark-metadata.repository';
import { MarkLocationRepository } from '../../repositories/mark-location.repository';
import { ScheduleService } from '../../../schedule/services/schedule.service';
import { MarkHelper } from '../../helpers/mark.helper';
import { MarkCategoryHelper } from '../../helpers/mark-category.helper';
import { ScheduleRepository } from '../../../schedule/repositories/schedule.repository';
import { ScheduleAreaRepository } from '../../../schedule/repositories/schedule-area.repository';
import { UserAlarmHistoryRepository } from '../../../user/repositories/user-alarm-history.repository';
import { UserService } from '../../../user/services/user.service';
import { UserProfileService } from '../../../user/services/user-profile.service';
import { ScheduleHelper } from '../../../schedule/helpers/schedule.helper';
import { UserHelper } from '../../../user/helpers/user.helper';
import { UserProfileHelper } from '../../../user/helpers/user-profile.helper';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserWithdrawReasonRepository } from '../../../user/repositories/user-withdraw-reason.repository';
import { UserAlarmSettingRepository } from '../../../user/repositories/user-alarm-setting.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { ColorService } from '../../../color/services/color.service';
import { ColorRepository } from '../../../color/repositories/color.repository';

describe('MarkCategoryService', () => {
  let markCategoryService: MarkCategoryService;
  let postMarkCategoryRequestDto: PostMarkCategoryRequestDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CoreModule,
        CustomRepositoryModule.forCustomRepository([
          MarkRepository,
          MarkCategoryRepository,
          MarkMetadataRepository,
          MarkLocationRepository,
          ScheduleRepository,
          ScheduleAreaRepository,
          UserAlarmHistoryRepository,
          UserRepository,
          UserWithdrawReasonRepository,
          ColorRepository,
        ]),
      ],
      providers: [
        MarkService,
        MarkCategoryService,
        ScheduleService,
        UserService,
        UserProfileService,
        MarkHelper,
        MarkCategoryHelper,
        ScheduleHelper,
        UserHelper,
        UserProfileHelper,
        UserAlarmSettingRepository,
        JwtService,
        JwtHelper,
        ColorService,
      ],
    }).compile();

    markCategoryService =
      moduleRef.get<MarkCategoryService>(MarkCategoryService);

    postMarkCategoryRequestDto = new PostMarkCategoryRequestDto('안녕');
    console.log(postMarkCategoryRequestDto);
  });

  it('createMarkCategory - 기록 카테고리 생성 API', async () => {
    expect(
      await markCategoryService.createMarkCategory(
        15,
        postMarkCategoryRequestDto,
      ),
    ).toEqual(1);
  });
});
