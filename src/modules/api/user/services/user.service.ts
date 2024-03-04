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
  IValidateSocialAccessToken,
} from 'src/modules/core/auth/types';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { LoginOrSignUpEnum } from '../constants/enums/user.enum';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { TDecodedUserToken } from '../types';
import { PostUserWithdrawRequestDto } from '../dtos/request/post-user-withdraw-request.dto';
import { decryptEmail } from 'src/helpers/crypt.helper';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
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
   * @summary 소셜 로그인 API - 회원가입 처리
   * @author  Jason
   * @param   { PostLoginOrSignUpRequestDto } body
   * @param   { IValidateSocialAccessToken } validateResult
   * @returns { Promise<PostLoginOrSignUpResponseDto> }
   */
  async createSignUp(
    body: PostLoginOrSignUpRequestDto,
    validateResult: IValidateSocialAccessToken,
  ): Promise<PostLoginOrSignUpResponseDto> {
    const insertUserParam = await this.userHelper.generateInsertUserParam(
      body,
      validateResult.data,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id: newUserId } = await queryRunner.manager.save(
        UserEntity,
        insertUserParam,
      );

      await queryRunner.manager.save(
        UserAlarmSettingEntity,
        body.toUserAlarmSettingEntity(newUserId),
      ); // 알림 설정 생성

      const newTokens = await this.authService.setUserToken(newUserId); // 토큰 생성

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
      this.modifyById(user.id, {
        fcmToken:
          isDefined(fcmToken) && fcmToken.length !== 0 ? fcmToken : null,
      }),
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
      await this.removeUserProfileImage(user);
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
