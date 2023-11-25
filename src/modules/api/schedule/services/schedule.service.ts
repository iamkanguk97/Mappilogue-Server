import { GetScheduleDetailByIdResponseDto } from './../dtos/get-schedule-detail-by-id-response.dto';
import { isEmptyArray } from 'src/helpers/common.helper';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { DataSource } from 'typeorm';
import { ScheduleRepository } from '../repositories/schedule.repository';
import {
  checkBetweenDatesWithNoMoment,
  getKoreanDateFormatByMultiple,
  getWeekendsByYearAndMonth,
} from 'src/helpers/date.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { UserProfileService } from '../../user-profile/services/user-profile.service';
import { UserService } from '../../user/services/user.service';
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
import { solar2lunar } from 'solarlunar';
import { GetScheduleOnSpecificDateResponseDto } from '../dtos/get-schedule-on-specific-date-response.dto';
import { ScheduleAreaRepository } from '../repositories/schedule-area.repository';
import { PutScheduleRequestDto } from '../dtos/put-schedule-request.dto';
import { GetScheduleAreasByIdResponseDto } from '../dtos/get-schedule-areas-by-id-response.dto';
import { ScheduleDto } from '../dtos/schedule.dto';
import { UserProfileHelper } from '../../user-profile/helpers/user-profile.helper';
import { GetSchedulesInCalendarRequestDto } from '../dtos/get-schedules-in-calendar-request.dto';
import { GetSchedulesInCalendarResponseDto } from '../dtos/get-schedules-in-calendar-response.dto';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly scheduleAreaRepository: ScheduleAreaRepository,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly notificationService: NotificationService,
    private readonly scheduleHelper: ScheduleHelper,
    private readonly userHelper: UserHelper,
    private readonly userProfileHelper: UserProfileHelper,
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
      this.logger.error(`[createSchedule - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeSchedule(schedule: ScheduleDto): Promise<void> {
    const deletedScheduleData = await this.scheduleRepository.find({
      where: {
        userId: schedule.userId,
        id: schedule.id,
      },
      relations: {
        scheduleAreas: true,
      },
    });

    await this.scheduleRepository.softRemove(deletedScheduleData);
  }

  async findScheduleOnSpecificId(
    schedule: ScheduleDto,
  ): Promise<GetScheduleDetailByIdResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const scheduleBaseInfo = await this.scheduleHelper.setScheduleOnDetail(
        schedule,
      );
      const scheduleAlarmInfo =
        await this.scheduleHelper.setScheduleAlarmsOnDetail(schedule);
      const scheduleAreaInfo =
        await this.scheduleAreaRepository.selectScheduleAreasById(schedule.id);

      await queryRunner.commitTransaction();
      return GetScheduleDetailByIdResponseDto.from(
        scheduleBaseInfo,
        scheduleAlarmInfo,
        this.scheduleHelper.preprocessScheduleAreaOnDetailById(
          scheduleAreaInfo,
        ),
      );
    } catch (err) {
      this.logger.error(`[findScheduleDetailById - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findSchedulesInCalendar(
    userId: number,
    query: GetSchedulesInCalendarRequestDto,
  ): Promise<GetSchedulesInCalendarResponseDto> {
    const weekendsList = getWeekendsByYearAndMonth(query.year, query.month);

    const calendarStartDay = weekendsList[0][0];
    const calendarEndDay = weekendsList[weekendsList.length - 1][1];

    const result = await this.scheduleRepository.selectSchedulesInCalendar(
      userId,
      calendarStartDay,
      calendarEndDay,
    );

    return GetSchedulesInCalendarResponseDto.of(result);
  }

  async findScheduleDetailById(userId: number, schedule: ScheduleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log(userId);
      console.log(schedule);

      schedule.setStartDate = '';
      schedule.setEndDate = '';

      console.log(schedule);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[findScheduleDetailById - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createScheduleArea(
    newScheduleId: number,
    body: PostScheduleRequestDto,
  ): Promise<void> {
    try {
      await Promise.all(
        body.area.map(async (area) => {
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
    if (!isEmptyArray(body.alarmOptions)) {
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

  async findSchedulesOnSpecificDate(
    userId: number,
    date: string,
  ): Promise<GetScheduleOnSpecificDateResponseDto> {
    const [year, month, day] = date.split('-').map(Number);
    const solarToLunarResult = solar2lunar(year, month, day);

    const lunarDate =
      this.scheduleHelper.generateLunarDateBySolarToLunarResult(
        solarToLunarResult,
      );

    const result = await this.scheduleRepository.selectSchedulesOnSpecificDate(
      userId,
      date,
    );

    return GetScheduleOnSpecificDateResponseDto.from(
      getKoreanDateFormatByMultiple(year, month, day),
      lunarDate,
      result,
    );
  }

  async findScheduleById(scheduleId: number): Promise<ScheduleEntity> {
    return this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
      },
    });
  }

  async findScheduleAreaById(
    scheduleAreaId: number,
  ): Promise<ScheduleAreaEntity> {
    return this.scheduleAreaRepository.findOne({
      where: {
        id: scheduleAreaId,
      },
    });
  }

  async modifyById(
    scheduleId: number,
    properties: Partial<ScheduleEntity>,
  ): Promise<void> {
    await this.scheduleRepository.updateById(scheduleId, properties);
  }

  async modifySchedule(
    schedule: ScheduleDto,
    body: PutScheduleRequestDto,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.modifyById(
        schedule.id,
        body.toScheduleEntity(schedule.userId),
      );
      await this.modifyScheduleArea(schedule.id, body);
      await this.modifyScheduleAlarms(); // TODO: 일정 수정 시 알림 적용해야함

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[modifySchedule - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findScheduleAreasById(
    scheduleId: number,
  ): Promise<GetScheduleAreasByIdResponseDto> {
    const result = await this.scheduleAreaRepository.selectScheduleAreasById(
      scheduleId,
    );
    return GetScheduleAreasByIdResponseDto.of(result);
  }

  async checkScheduleStatus(
    userId: number,
    scheduleId: number,
  ): Promise<ScheduleDto> {
    const scheduleStatus = await this.findScheduleById(scheduleId);

    if (!this.scheduleHelper.isScheduleExist(scheduleStatus)) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleNotExist);
    }
    if (scheduleStatus.userId !== userId) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleNotMine);
    }

    return ScheduleDto.of(scheduleStatus);
  }

  async checkScheduleAreaStatus(
    scheduleAreaId: number,
    scheduleId: number,
  ): Promise<void> {
    const scheduleAreaStatus = await this.findScheduleAreaById(scheduleAreaId);

    if (!this.scheduleHelper.isScheduleAreaExist(scheduleAreaStatus)) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleAreaNotExist);
    }
    if (scheduleAreaStatus.scheduleId !== scheduleId) {
      throw new BadRequestException(
        ScheduleExceptionCode.ScheduleAreaNotMathWithSchedule,
      );
    }

    return;
  }

  async modifyScheduleArea(
    scheduleId: number,
    body: PutScheduleRequestDto,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.scheduleAreaRepository.delete({
        scheduleId,
      });
      await this.createScheduleArea(scheduleId, body);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`[modifyScheduleArea - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async modifyScheduleAlarms() {
    return;
  }
}
