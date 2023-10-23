import { setCheckColumnByValue } from 'src/helpers/common.helper';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { DataSource } from 'typeorm';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { checkBetweenDatesWithNoMoment } from 'src/helpers/date.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { ScheduleAreaRepotory } from '../repositories/schedule-area.repository';
import { CheckColumnEnum } from 'src/constants/enum';
import { UserProfileService } from '../../user-profile/services/user-profile.service';
import { UserService } from '../../user/services/user.service';
import { UserProfileHelper } from '../../user-profile/helpers/user-profile.helper';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { NotificationService } from 'src/modules/core/notification/services/notification.service';
import { UserHelper } from '../../user/helpers/user.helper';
import { UserAlarmHistoryRepository } from '../../user/repositories/user-alarm-history.repository';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userProfileService: UserProfileService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly userProfileHelper: UserProfileHelper,
    private readonly userHelper: UserHelper,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly scheduleAreaRepository: ScheduleAreaRepotory,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
  ) {}

  async createSchedule(
    userId: number,
    body: PostScheduleRequestDto,
  ): Promise<number | void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id: newScheduleId } = await this.scheduleRepository.save(
        body.toScheduleEntity(userId),
      );

      await this.createScheduleArea(newScheduleId, body);
      await this.createScheduleAlarms(newScheduleId, userId, body);

      await queryRunner.commitTransaction();
      return newScheduleId;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      Logger.error(`[create - Schedule Domain] ${err}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
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
              return {
                ...areaValue,
                scheduleId: newScheduleId,
                date: area.date,
                sequence: idx + 1,
              };
            },
          );
          this.scheduleAreaRepository.save(createScheduleAreaValueParam);
        }),
      );
    } catch (err) {
      throw err;
    }
  }

  async createScheduleAlarms(
    userId: number,
    newScheduleId: number,
    body: PostScheduleRequestDto,
  ): Promise<void> {
    if (setCheckColumnByValue(body.alarmOptions) === CheckColumnEnum.ACTIVE) {
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
      await this.userHelper.isUserFcmTokenValid(fcmToken);

      try {
        await Promise.all(
          body.alarmOptions.map(async (alarmOption) => {
            const { id } = await this.userAlarmHistoryRepository.save({
              userId,
              scheduleId: newScheduleId,
              title: this.notificationService.pushTitleBySchedule,
              body: this.notificationService.pushBodyBySchedule,
              alarmDate: alarmOption,
              type: 'SCHEDULE-REMINDER',
            });
          }),
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
}
