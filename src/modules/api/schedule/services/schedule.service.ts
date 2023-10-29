import { setCheckColumnByValue } from 'src/helpers/common.helper';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { DataSource } from 'typeorm';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { checkBetweenDatesWithNoMoment } from 'src/helpers/date.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { ScheduleAreaRepotory } from '../repositories/schedule-area.repository';
import { CheckColumnEnum, StatusColumnEnum } from 'src/constants/enum';
import { UserProfileService } from '../../user-profile/services/user-profile.service';
import { UserService } from '../../user/services/user.service';
import { UserProfileHelper } from '../../user-profile/helpers/user-profile.helper';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { NotificationService } from 'src/modules/core/notification/services/notification.service';
import { UserHelper } from '../../user/helpers/user.helper';
import { UserAlarmHistoryRepository } from '../../user/repositories/user-alarm-history.repository';
import { ScheduleEntity } from '../entities/schedule.entity';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { PostScheduleResponseDto } from '../dtos/post-schedule-response.dto';
import { NotificationTypeEnum } from 'src/modules/core/notification/constants/notification.enum';
import { UserAlarmHistoryEntity } from '../../user/entities/user-alarm-history.entity';
import { ScheduleHelper } from '../helpers/schedule.helper';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userProfileService: UserProfileService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly userProfileHelper: UserProfileHelper,
    private readonly userHelper: UserHelper,
    private readonly scheduleHelper: ScheduleHelper,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly scheduleAreaRepository: ScheduleAreaRepotory,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
  ) {}

  async createSchedule(
    userId: number,
    body: PostScheduleRequestDto,
  ): Promise<PostScheduleResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id: newScheduleId } = await this.scheduleRepository.save(
        body.toScheduleEntity(userId),
      );

      await this.createScheduleArea(newScheduleId, body);
      await this.createScheduleAlarms(userId, newScheduleId, body);

      await queryRunner.commitTransaction();
      return PostScheduleResponseDto.of(newScheduleId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.error(`[createSchedule] ${err}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeSchedule(userId: number, scheduleId: number): Promise<void> {
    await this.scheduleRepository.delete({ userId, id: scheduleId });
  }

  async createScheduleArea(
    newScheduleId: number,
    body: PostScheduleRequestDto,
  ): Promise<void> {
    const areaData = body.area ?? [];

    try {
      await Promise.all(
        areaData.map(async (area) => {
          if (
            !checkBetweenDatesWithNoMoment(
              body.startDate,
              body.endDate,
              area.date,
            )
          ) {
            throw new BadRequestException(
              ScheduleExceptionCode.ScheduleAreaDateNotBetweenStartAndEndDate,
            );
          }

          const createScheduleAreaValueParam = area.value.map(
            (areaValue, idx) => {
              return ScheduleAreaEntity.from(
                newScheduleId,
                areaValue.name,
                area.date,
                areaValue.streetAddress,
                areaValue.latitude,
                areaValue.longitude,
                idx + 1,
                areaValue.time,
              );
            },
          );
          this.scheduleAreaRepository.save(createScheduleAreaValueParam);
        }),
      );
    } catch (err) {
      this.logger.error(`[createScheduleArea] ${err}`);
      throw err;
    }
  }

  async createScheduleAlarms(
    userId: number,
    newScheduleId: number,
    body: PostScheduleRequestDto,
  ): Promise<void> {
    if (setCheckColumnByValue(body.alarmOptions) === CheckColumnEnum.ACTIVE) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const userAlarmSettings =
          await this.userProfileService.findUserAlarmSettingById(userId);

        if (
          !this.userProfileHelper.checkCanSendScheduleAlarm(userAlarmSettings)
        ) {
          throw new BadRequestException(
            UserExceptionCode.RequireAlarmAcceptInSchedule,
          );
        }

        const userStatus = await this.userService.findOneById(userId);
        const fcmToken = userStatus.fcmToken;
        const isFcmTokenActive = await this.userHelper.isUserFcmTokenValid(
          fcmToken,
        );

        if (isFcmTokenActive) {
          const notificationMessage =
            this.scheduleHelper.generateScheduleNotificationMessage(
              body.startDate,
              body.title,
            );

          try {
            await Promise.all(
              body.alarmOptions.map(async (alarmOption) => {
                const { id } = await this.userAlarmHistoryRepository.save(
                  UserAlarmHistoryEntity.from(
                    userId,
                    newScheduleId,
                    notificationMessage.title,
                    notificationMessage.body,
                    alarmOption,
                    NotificationTypeEnum.SCHEDULE_REMINDER,
                  ),
                );

                await this.notificationService.sendPushForScheduleCreate(
                  id,
                  notificationMessage.title,
                  notificationMessage.body,
                  fcmToken,
                  alarmOption,
                );
              }),
            );
          } catch (err) {
            this.logger.error(`[createScheduleAlarms] ${err}`);
          }
        }

        await queryRunner.commitTransaction();
      } catch (err) {
        this.logger.error(`[createScheduleAlarms - transaction error] ${err}`);
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    }
  }

  async findScheduleById(scheduleId: number): Promise<ScheduleEntity> {
    return this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
        status: StatusColumnEnum.ACTIVE,
      },
    });
  }
}
