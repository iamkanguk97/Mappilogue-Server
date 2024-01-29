import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ICustomJwtPayload,
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
import { decryptEmail } from 'src/helpers/crypt.helper';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { LoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { UserAlarmSettingRepository } from '../repositories/user-alarm-setting.repository';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { DataSource, QueryRunner, Equal, FindOptionsWhere } from 'typeorm';
import { UserAlarmHistoryRepository } from '../repositories/user-alarm-history.repository';
import { isDefined } from 'src/helpers/common.helper';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
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
    ) as ICustomJwtPayload;
    const userId = refreshPayload.userId;

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
      await Promise.all([
        this.modifyById(userId, { fcmToken: null }, queryRunner),
        this.customCacheService.delValue(refreshTokenRedisKey),
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[logout - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @summary 회원탈퇴 API Service
   * @author  Jason
   * @param   { DecodedUserToken } user
   * @param   { PostUserWithdrawRequestDto } body
   */
  async createWithdraw(
    user: DecodedUserToken,
    body: PostUserWithdrawRequestDto,
  ): Promise<void> {
    const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(
      user.id,
    );
    user.email = decryptEmail(user.email);

    const deleteTarget = await this.userRepository.find({
      where: { id: user.id },
      relations: [
        'userAlarmSetting',
        'schedules',
        'schedules.scheduleAreas',
        'markCategories',
        'marks',
        'marks.markMetadata',
        'marks.markLocation',
      ],
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        // queryRunner.manager.softRemove(UserEntity, deleteTarget),
        queryRunner.manager.save(UserWithdrawReasonEntity, body.toEntity(user)),
        //this.customCacheService.delValue(refreshTokenRedisKey),
        // this.removeUserProfileImage(user),
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[createWithdraw - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @summary 사용자 프로필 이미지 삭제하기
   * @author  Jason
   * @param   { DecodedUserToken } user
   */
  async removeUserProfileImage(user: DecodedUserToken): Promise<void> {
    const userProfileKey = user?.profileImageKey;

    if (isDefined(userProfileKey) && userProfileKey !== '') {
      const imageDeleteBuilder = new MulterBuilder(ImageBuilderTypeEnum.DELETE);
      await imageDeleteBuilder.delete(user.profileImageKey);
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

  async findOneBySnsId(socialId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { snsId: socialId },
    });
  }

  /**
   * @summary find one user by id
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<UserEntity> }
   */
  async findOneById(userId: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }

  /**
   * @summary update user by id
   * @author  Jason
   * @param   { number } userId
   * @param   { Partial<UserEntity> } properties
   * @param   { QueryRunner } queryRunner
   */
  async modifyById(
    userId: number,
    properties: Partial<UserEntity>,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const criteria = { id: userId };

    if (isDefined(queryRunner)) {
      await queryRunner.manager.update(UserEntity, criteria, properties);
      return;
    }
    await this.userRepository.update(criteria, properties);
  }
}
