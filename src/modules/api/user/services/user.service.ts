import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ICustomJwtPayload,
  ITokenWithExpireTime,
  IValidateSocialAccessTokenResult,
} from 'src/modules/core/auth/interfaces';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { ELoginOrSignUp } from '../variables/enums/user.enum';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { PostUserWithdrawRequestDto } from '../dtos/request/post-user-withdraw-request.dto';
import { decryptEmail } from 'src/helpers/crypt.helper';
import { DataSource, QueryRunner } from 'typeorm';
import { isDefined } from 'src/helpers/common.helper';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';
import { PostLoginOrSignUpRequestDto } from '../dtos/request/post-login-or-sign-up-request.dto';
import { PostLoginOrSignUpResponseDto } from '../dtos/response/post-login-or-sign-up-response.dto';
import { PostTokenRefreshResponseDto } from '../dtos/response/post-token-refresh-response.dto';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly customCacheService: CustomCacheService,
    private readonly userHelper: UserHelper,
    private readonly jwtHelper: JwtHelper,
  ) {}

  /**
   * @summary 소셜 로그인 API Service - 회원가입 처리
   * @author  Jason
   * @param   { PostLoginOrSignUpRequestDto } body
   * @param   { IValidateSocialAccessTokenResult } validateResult
   * @returns { Promise<PostLoginOrSignUpResponseDto> }
   */
  async createSignUp(
    body: PostLoginOrSignUpRequestDto,
    validateResult: IValidateSocialAccessTokenResult,
  ): Promise<PostLoginOrSignUpResponseDto> {
    let newUserId: number;

    const insertUserParam = await this.userHelper.generateInsertUserParam(
      body,
      validateResult.data,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      newUserId = (await queryRunner.manager.save(UserEntity, insertUserParam))
        .id;

      await queryRunner.manager.save(
        UserAlarmSettingEntity,
        body.toUserAlarmSettingEntity(newUserId),
      ); // 알림 설정 생성

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[createSignUp - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    const newTokens = await this.authService.setUserToken(newUserId); // 토큰 생성

    return PostLoginOrSignUpResponseDto.from(
      ELoginOrSignUp.SIGNUP,
      newUserId,
      newTokens,
    );
  }

  /**
   * @summary 소셜 로그인 API Service - 로그인 처리
   * @author  Jason
   * @param   { UserEntity } user
   * @param   { string | null } fcmToken
   * @returns { Promise<PostLoginOrSignUpResponseDto> }
   */
  async createLogin(
    user: UserEntity,
    fcmToken: string | null,
  ): Promise<PostLoginOrSignUpResponseDto> {
    /**
     * @comment 로그인에서는 isAlarmAccept property를 무시한다 (알림 업데이트 X)
     */

    await this.modifyById(user.id, {
      fcmToken: isDefined(fcmToken) && fcmToken.length !== 0 ? fcmToken : null,
    });

    const newTokens = await this.authService.setUserToken(user.id);

    return PostLoginOrSignUpResponseDto.from(
      ELoginOrSignUp.LOGIN,
      user.id,
      newTokens,
    );
  }

  /**
   * @summary 토큰 재발급 API Service
   * @author  Jason
   * @param   { string } refreshToken
   * @returns { Promise<PostTokenRefreshResponseDto> }
   */
  async createTokenRefresh(
    refreshToken: string,
  ): Promise<PostTokenRefreshResponseDto> {
    const refreshPayload = this.jwtService.decode(
      refreshToken,
    ) as ICustomJwtPayload | null;
    const userId = refreshPayload?.userId ?? -1;

    const checkUserStatus = await this.findOneById(userId);

    const isUserRefreshTokenValidResult =
      await this.userHelper.isUserRefreshTokenValid(
        refreshToken,
        refreshPayload,
        checkUserStatus,
      );

    if (!isUserRefreshTokenValidResult) {
      throw new UnauthorizedException(UserExceptionCode.InvalidRefreshToken);
    }

    const result = await this.authService.setUserToken(userId);
    return PostTokenRefreshResponseDto.from(userId, result);
  }

  /**
   * @summary 로그아웃 API Service
   * @param   { ITokenWithExpireTime } data
   * @author  Jason
   */
  async logout(data: ITokenWithExpireTime): Promise<void> {
    const { user, accessToken, remainExpireTime } = data;
    const userId = user.id;

    const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(userId);

    await this.modifyById(userId, { fcmToken: null });
    await this.customCacheService.delValue(refreshTokenRedisKey);
    await this.customCacheService.setBlackList(accessToken, remainExpireTime);

    return;
  }

  /**
   * @summary 회원탈퇴 API Service
   * @author  Jason
   * @param   { ITokenWithExpireTime } data
   * @param   { PostUserWithdrawRequestDto } body
   */
  async createWithdraw(
    data: ITokenWithExpireTime,
    body: PostUserWithdrawRequestDto,
  ): Promise<void> {
    const { user, accessToken, remainExpireTime } = data;
    const userId = user.id;

    const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(userId);

    if (isDefined(user.email)) {
      user.email = decryptEmail(user.email);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        queryRunner.manager.softRemove(
          UserEntity,
          await this.userRepository.find({
            where: { id: userId },
          }),
        ),
        queryRunner.manager.save(UserWithdrawReasonEntity, body.toEntity(user)),
      ]);

      await queryRunner.commitTransaction();

      await this.customCacheService.delValue(refreshTokenRedisKey);
      await this.customCacheService.setBlackList(accessToken, remainExpireTime);
      await this.userHelper.removeUserProfileImage(user);
      await this.authService.disconnectFromAppleInWithdraw(user);

      return;
    } catch (err) {
      this.logger.error(`[createWithdraw - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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

  /**
   * @summary 사용자와 사용자 알림 설정 정보 가져오기
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<UserEntity> }
   */
  async findUserWithAlarmSetting(userId: number): Promise<UserEntity> {
    const result = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userAlarmSetting'],
    });

    if (!isDefined(result)) {
      throw new ForbiddenException(UserExceptionCode.NotExistUser);
    }

    if (!isDefined(result.userAlarmSetting)) {
      throw new BadRequestException(
        UserExceptionCode.GetUserAlarmSettingNotExist,
      );
    }

    return result;
  }
}
