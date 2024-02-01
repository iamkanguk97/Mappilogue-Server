import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ICustomJwtPayload, TSocialFactory } from 'src/modules/core/auth/types';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';
import { LoginOrSignUpEnum } from '../constants/user.enum';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { TDecodedUserToken } from '../types';
import { PostUserWithdrawRequestDto } from '../dtos/post-user-withdraw-request.dto';
import { decryptEmail } from 'src/helpers/crypt.helper';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { UserAlarmHistoryRepository } from '../repositories/user-alarm-history.repository';
import { isDefined } from 'src/helpers/common.helper';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';
import { PostLoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { PostLoginOrSignUpResponseDto } from '../dtos/login-or-sign-up-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly customCacheService: CustomCacheService,
    private readonly userHelper: UserHelper,
    private readonly jwtHelper: JwtHelper,
  ) {}

  /**
   * @summary 소셜 로그인 API - 회원가입 처리
   * @author  Jason
   * @param   { TSocialFactory } userSocialFactory
   * @param   { PostLoginOrSignUpRequestDto } body
   * @returns { Promise<PostLoginOrSignUpResponseDto> }
   */
  async createSignUp(
    userSocialFactory: TSocialFactory,
    body: PostLoginOrSignUpRequestDto,
  ): Promise<PostLoginOrSignUpResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUserId = await this.createUser(socialUserInfo, body.fcmToken);

      await queryRunner.manager.save(
        UserAlarmSettingEntity,
        body.toUserAlarmSettingEntity(newUserId),
      );

      // TODO: type을 ProcessedSocialAppleInfo도 추가해야함.
      const socialUserInfo = (await userSocialFactory.getUserSocialInfo()) as
        | ProcessedSocialKakaoInfo
        | any;

      // TODO: Apple Login 구현 시 repository로 전달하는 parameter entity-from 구현
      const newTokens = await this.authService.setUserToken(newUserId);

      await queryRunner.commitTransaction();
      return PostLoginOrSignUpResponseDto.from(
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

  /**
   * @summary 소셜 로그인 API - 로그인 처리
   * @author  Jason
   * @param   { UserEntity } user
   * @param   { string | null } fcmToken
   * @returns { Promise<PostLoginOrSignUpResponseDto> }
   */
  async createLogin(
    user: UserEntity,
    fcmToken?: string | null,
  ): Promise<PostLoginOrSignUpResponseDto> {
    /**
     * @comment 로그인에서는 isAlarmAccept property를 무시한다 (알림 업데이트 X)
     */

    const [tokens] = await Promise.all([
      this.authService.setUserToken(user.id),
      this.modifyById(user.id, { fcmToken }),
    ]);

    return PostLoginOrSignUpResponseDto.from(
      LoginOrSignUpEnum.LOGIN,
      user.id,
      tokens,
    );
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
   * @param   { TDecodedUserToken } user
   * @param   { PostUserWithdrawRequestDto } body
   */
  async createWithdraw(
    user: TDecodedUserToken,
    body: PostUserWithdrawRequestDto,
  ): Promise<void> {
    const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(
      user.id,
    );
    user.email = decryptEmail(user.email);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        queryRunner.manager.softRemove(
          UserEntity,
          await this.userRepository.find({
            where: { id: user.id },
          }),
        ),
        queryRunner.manager.save(UserWithdrawReasonEntity, body.toEntity(user)),
        this.customCacheService.delValue(refreshTokenRedisKey),
        this.removeUserProfileImage(user),
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
   * @param   { TDecodedUserToken } user
   */
  async removeUserProfileImage(user: TDecodedUserToken): Promise<void> {
    const userProfileKey = user.profileImageKey;

    if (isDefined(userProfileKey) && userProfileKey.length !== 0) {
      const imageDeleteBuilder = new MulterBuilder(ImageBuilderTypeEnum.DELETE);
      await imageDeleteBuilder.delete(userProfileKey);
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

  /**
   * @summary find one user by snsId
   * @author  Jason
   * @param   { string } socialId
   * @returns { Promise<UserEntity | null> }
   */
  async findOneBySnsId(socialId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { snsId: socialId },
    });
  }

  /**
   * @summary find one user by id
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<UserEntity | null> }
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
