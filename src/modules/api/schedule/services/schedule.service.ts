import { GetScheduleDetailByIdResponseDto } from '../dtos/response/get-schedule-detail-by-id-response.dto';
import { isDefined, isEmptyArray } from 'src/helpers/common.helper';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/request/post-schedule-request.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { ScheduleRepository } from '../repositories/schedule.repository';
import {
  checkBetweenDatesWithNoMoment,
  getKoreanDateFormatByMultiple,
  getWeekendsByYearAndMonth,
} from 'src/helpers/date.helper';
import { ScheduleExceptionCode } from 'src/common/exception-code/schedule.exception-code';
import { UserProfileService } from '../../user/services/user-profile.service';
import { UserService } from '../../user/services/user.service';
import { NotificationService } from 'src/modules/core/notification/services/notification.service';
import { UserHelper } from '../../user/helpers/user.helper';
import { UserAlarmHistoryRepository } from '../../user/repositories/user-alarm-history.repository';
import { ScheduleEntity } from '../entities/schedule.entity';
import { ScheduleAreaEntity } from '../entities/schedule-area.entity';
import { PostScheduleResponseDto } from '../dtos/response/post-schedule-response.dto';
import { NotificationTypeEnum } from 'src/modules/core/notification/constants/notification.enum';
import { UserAlarmHistoryEntity } from '../../user/entities/user-alarm-history.entity';
import { ScheduleHelper } from '../helpers/schedule.helper';
import { solar2lunar } from 'solarlunar';
import { GetScheduleOnSpecificDateResponseDto } from '../dtos/get-schedule-on-specific-date-response.dto';
import { ScheduleAreaRepository } from '../repositories/schedule-area.repository';
import { PutScheduleRequestDto } from '../dtos/put-schedule-request.dto';
import { GetScheduleAreasByIdResponseDto } from '../dtos/response/get-schedule-areas-by-id-response.dto';
import { ScheduleDto } from '../dtos/schedule.dto';
import { UserProfileHelper } from '../../user/helpers/user-profile.helper';
import { GetSchedulesInCalendarRequestDto } from '../dtos/get-schedules-in-calendar-request.dto';
import { GetSchedulesInCalendarResponseDto } from '../dtos/get-schedules-in-calendar-response.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly scheduleAreaRepository: ScheduleAreaRepository,
    private readonly userRepository: UserRepository,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly notificationService: NotificationService,
    private readonly scheduleHelper: ScheduleHelper,
    private readonly userHelper: UserHelper,
    private readonly userProfileHelper: UserProfileHelper,
  ) {}

  /**
   * @summary 일정 생성 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { PostScheduleRequestDto } body
   * @returns { Promise<PostScheduleResponseDto> }
   */
  async createSchedule(
    userId: number,
    body: PostScheduleRequestDto,
  ): Promise<PostScheduleResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id: newScheduleId } = await queryRunner.manager.save(
        ScheduleEntity,
        body.toScheduleEntity(userId),
      );

      await Promise.all([
        this.createScheduleArea(queryRunner, newScheduleId, body),
        this.createScheduleAlarms(queryRunner, userId, newScheduleId, body),
      ]);

      await queryRunner.rollbackTransaction();
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

  /**
   * @summary 일정 삭제하기 API Service
   * @author  Jason
   * @param   { ScheduleDto } schedule
   */
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

  /**
   * @summary 특정 일정 조회하기 API Service
   * @author  Jason
   * @param   { ScheduleDto } schedule
   * @returns { Promise<GetScheduleDetailByIdResponseDto> }
   */
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

  /**
   * @summary 일정 생성 API Service - 장소 부분 생성
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { number } newScheduleId
   * @param   { PostScheduleRequestDto } body
   */
  async createScheduleArea(
    queryRunner: QueryRunner,
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
                idx + 1,
                areaValue.streetAddress,
                areaValue.latitude,
                areaValue.longitude,
                areaValue.time,
              );
            },
          );

          await queryRunner.manager.save(
            ScheduleAreaEntity,
            createScheduleAreaValueParam,
          );
        }),
      );
    } catch (err) {
      this.logger.error(`[createScheduleArea] ${err}`);
      throw err;
    }
  }

  /**
   * @summary 일정 생성 API Service - 알림 부분 생성
   * @author  Jason
   * @param   { QueryRunner } queryRunner
   * @param   { number } userId
   * @param   { number } newScheduleId
   * @param   { PostScheduleRequestDto } body
   */
  async createScheduleAlarms(
    queryRunner: QueryRunner,
    userId: number,
    newScheduleId: number,
    body: PostScheduleRequestDto,
  ): Promise<void> {
    const alarmOptions = body.alarmOptions;

    if (isDefined(alarmOptions) && !isEmptyArray(alarmOptions)) {
      const [userAlarmSetting, userStatus] = await Promise.all([
        this.userProfileService.findUserAlarmSettingById(userId),
        this.userService.findOneById(userId),
      ]);

      if (!isDefined(userStatus)) {
        throw new BadRequestException(UserExceptionCode.NotExistUser);
      }

      const fcmToken = userStatus.fcmToken;
      const isFcmTokenValid = await this.userHelper.isUserFcmTokenValid(
        fcmToken,
      );

      if (
        isFcmTokenValid &&
        this.userProfileHelper.checkCanSendScheduleAlarm(userAlarmSetting)
      ) {
        const message =
          this.scheduleHelper.generateScheduleNotificationMessage(body);
        console.log(message);

        try {
          await Promise.all(
            alarmOptions.map(async (option) => {
              console.log(option);
            }),
          );
        } catch (err) {
          console.log(err);
        }
      }

      //     await Promise.all(
      //       alarmOptions.map(async (alarmOption) => {
      //         const { id } = await this.userAlarmHistoryRepository.save(
      //           UserAlarmHistoryEntity.from(
      //             userId,
      //             newScheduleId,
      //             notificationMessage.title,
      //             notificationMessage.body,
      //             alarmOption,
      //             NotificationTypeEnum.SCHEDULE_REMINDER,
      //           ),
      //         );
      //         await this.notificationService.sendPushForScheduleCreate(
      //           id,
      //           notificationMessage.title,
      //           notificationMessage.body,
      //           fcmToken,
      //           alarmOption,
      //         );
      //       }),
      //     );
      //   } catch (err) {
      //     this.logger.error(
      //       `[createScheduleAlarms - notification part] ${err}`,
      //     );
      //   }
      // }
      // await queryRunner.commitTransaction();
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

  /**
   * @summary find one by id
   * @author  Jason
   * @param   { number } scheduleId
   * @returns { Promise<ScheduleEntity | null> }
   */
  async findOneById(scheduleId: number): Promise<ScheduleEntity | null> {
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
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    if (isDefined(queryRunner)) {
      await queryRunner.manager.update(
        ScheduleEntity,
        { id: scheduleId },
        properties,
      );
      return;
    }
    await this.scheduleRepository.update({ id: scheduleId }, properties);
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

  /**
   * @summary 특정 일정의 장소 조회하기 API Service
   * @author  Jason
   * @param   { number } scheduleId
   * @returns { Promise<GetScheduleAreasByIdResponseDto> }
   */
  async findScheduleAreasById(
    scheduleId: number,
  ): Promise<GetScheduleAreasByIdResponseDto> {
    const result = await this.scheduleAreaRepository.selectScheduleAreasById(
      scheduleId,
    );
    return GetScheduleAreasByIdResponseDto.of(result);
  }

  /**
   * @summary 일정 상태 확인 함수
   * @author  Jason
   * @param   { number } userId
   * @param   { number } scheduleId
   * @returns { Promise<ScheduleDto> }
   */
  async checkScheduleStatus(
    userId: number,
    scheduleId: number,
  ): Promise<ScheduleDto> {
    const scheduleStatus = await this.findOneById(scheduleId);

    if (!isDefined(scheduleStatus)) {
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

    if (!isDefined(scheduleAreaStatus)) {
      throw new BadRequestException(ScheduleExceptionCode.ScheduleAreaNotExist);
    }
    if (scheduleAreaStatus.scheduleId !== scheduleId) {
      throw new BadRequestException(
        ScheduleExceptionCode.ScheduleAreaNotMathWithSchedule,
      );
    }
  }

  async modifyScheduleArea(
    scheduleId: number,
    body: PutScheduleRequestDto,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.scheduleAreaRepository.softDelete({
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
