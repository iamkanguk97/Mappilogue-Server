import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  CustomJwtPayload,
  SocialFactoryType,
} from 'src/modules/core/auth/types';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';
import { LoginOrSignUpResponseDto } from '../dtos/login-or-sign-up-response.dto';
import { LoginOrSignUpEnum } from '../constants/user.enum';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { DecodedUserToken, ProcessedSocialKakaoInfo } from '../types';
import { PostUserWithdrawRequestDto } from '../dtos/post-user-withdraw-request.dto';
import { UserWithdrawReasonRepository } from '../repositories/user-withdraw-reason.repository';
import { decryptEmail } from 'src/helpers/crypt.helper';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { LoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { UserAlarmSettingRepository } from '../repositories/user-alarm-setting.repository';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { DataSource, Equal, QueryRunner } from 'typeorm';
import { UserAlarmHistoryRepository } from '../repositories/user-alarm-history.repository';
import { isDefined } from 'src/helpers/common.helper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly userWithdrawReasonRepository: UserWithdrawReasonRepository,
    private readonly userAlarmSettingRepository: UserAlarmSettingRepository,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly customCacheService: CustomCacheService,
    private readonly userHelper: UserHelper,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async createSignUp(
    userSocialFactory: SocialFactoryType,
    body: LoginOrSignUpRequestDto,
  ): Promise<LoginOrSignUpResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // TODO: type을 ProcessedSocialAppleInfo도 추가해야함.
      const socialUserInfo = (await userSocialFactory.getUserSocialInfo()) as
        | ProcessedSocialKakaoInfo
        | any;

      // TODO: Apple Login 구현 시 repository로 전달하는 parameter entity-from 구현
      const newUserId = await this.createUser(socialUserInfo, body.fcmToken);
      const newTokens = await this.authService.setUserToken(newUserId);
      await this.userAlarmSettingRepository.save(
        UserAlarmSettingEntity.fromValue(newUserId, body.isAlarmAccept),
      );

      await queryRunner.commitTransaction();
      return LoginOrSignUpResponseDto.from(
        LoginOrSignUpEnum.SIGNUP,
        newUserId,
        newTokens,
      );
    } catch (err) {
      this.logger.error(`[createSignUp - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createLogin(
    user: UserEntity,
    fcmToken?: string | undefined,
  ): Promise<LoginOrSignUpResponseDto> {
    /**
     * @comment 로그인에서는 isAlarmAccept property를 무시한다 (알림 업데이트 X)
     */

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tokens = await this.authService.setUserToken(user.id);
      await this.modifyById(user.id, { fcmToken });

      await queryRunner.commitTransaction();
      return LoginOrSignUpResponseDto.from(
        LoginOrSignUpEnum.LOGIN,
        user.id,
        tokens,
      );
    } catch (err) {
      this.logger.error(`[login - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @summary 토큰 재발급 API Service
   * @author  Jason
   * @param   { string } refreshToken
   * @returns { Promise<TokenRefreshResponseDto> }
   */
  async createTokenRefresh(
    refreshToken: string,
  ): Promise<TokenRefreshResponseDto> {
    const refreshPayload = this.jwtService.decode(
      refreshToken,
    ) as CustomJwtPayload;
    const userId = refreshPayload?.userId;

    const checkUserStatus = await this.findOneById(userId);

    const isUserRefreshTokenValidResult =
      await this.userHelper.isUserRefreshTokenValid(
        refreshPayload,
        refreshToken,
        checkUserStatus,
      );

    if (!isUserRefreshTokenValidResult) {
      throw new UnauthorizedException(UserExceptionCode.InvalidRefreshToken);
    }

    const result = await this.authService.setUserToken(userId);
    return TokenRefreshResponseDto.from(userId, result);
  }

  async createUser(
    socialUserInfo: ProcessedSocialKakaoInfo,
    fcmToken?: string | undefined,
  ): Promise<number> {
    return await this.userRepository.insertUser({
      ...socialUserInfo,
      fcmToken,
    });
  }

  /**
   * @summary 로그아웃 API Service
   * @author  Jason
   * @param   { number } userId
   */
  async logout(userId: number): Promise<void> {
    const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.customCacheService.delValue(refreshTokenRedisKey);
      await this.modifyById(userId, { fcmToken: null });

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[logout - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createWithdraw(
    user: DecodedUserToken,
    body: PostUserWithdrawRequestDto,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(
        user.id,
      );
      user.email = decryptEmail(user.email);

      /**
       * 사용자가 삭제되면서 deletedAt이 추가되어야 할 것들
       * - userAlarmSetting
       * - userAlarmHistory
       * - schedule: schedule이 사라지면 그 schedule에 해당하는 애들도 삭제해야 하는데?
       * - mark: mark도 마찬가지....!
       */
      const deleteTargetUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['userAlarmSetting', 'markCategories'],
      });

      console.log(deleteTargetUser);

      await this.customCacheService.delValue(refreshTokenRedisKey);
      // await this.userRepository.softDelete({ id: user.id });
      await this.userRepository.softRemove(deleteTargetUser);
      await this.userWithdrawReasonRepository.save(body.toEntity(user));

      if (user.profileImageKey !== '') {
        const imageDeleteBuilder = new MulterBuilder(
          ImageBuilderTypeEnum.DELETE,
          user.id,
        );
        await imageDeleteBuilder.delete(user.profileImageKey);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[createWithdraw - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserScheduleAlarms(
    userId: number,
    scheduleId: number,
  ): Promise<string[]> {
    const result =
      await this.userAlarmHistoryRepository.selectUserScheduleAlarms(
        userId,
        scheduleId,
      );
    return result.map((r) => r.alarmDate);
  }

  async findOneBySnsId(socialId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { snsId: socialId },
    });
  }

  /**
   * @summary find one user by id
   * @author  Jason
   * @param   { number | undefined } userId
   * @returns { Promise<UserEntity> }
   */
  async findOneById(userId?: number | undefined): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: Equal(userId) },
    });
  }

  /**
   * @summary update user by id
   * @author  Jason
   * @param   { number } userId
   * @param   { Partial<UserEntity> } properties
   * @param   { QueryRunner | undefined } queryRunner
   */
  async modifyById(
    userId: number,
    properties: Partial<UserEntity>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    const criteria = this.userHelper.setUpdateUserCriteria(userId);

    if (isDefined(queryRunner)) {
      await queryRunner.manager.update(UserEntity, criteria, properties);
      return;
    }
    await this.userRepository.update(criteria, properties);
  }
}
