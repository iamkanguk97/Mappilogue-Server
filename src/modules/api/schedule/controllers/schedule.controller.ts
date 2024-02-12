import { GetScheduleOnSpecificDateRequestDto } from './../dtos/get-schedule-on-specific-date-request.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PostScheduleRequestDto } from '../dtos/request/post-schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ScheduleValidationPipe } from '../pipes/schedule-validation.pipe';
import { ScheduleDto } from '../dtos/schedule.dto';
import { PostScheduleResponseDto } from '../dtos/response/post-schedule-response.dto';
import { GetScheduleOnSpecificDateResponseDto } from '../dtos/get-schedule-on-specific-date-response.dto';
import { GetScheduleDetailByIdResponseDto } from '../dtos/response/get-schedule-detail-by-id-response.dto';
import { PutScheduleRequestDto } from '../dtos/request/put-schedule-request.dto';
import { GetScheduleAreasByIdResponseDto } from '../dtos/response/get-schedule-areas-by-id-response.dto';
import { DomainNameEnum } from 'src/constants/enum';
import { GetSchedulesInCalendarRequestDto } from '../dtos/get-schedules-in-calendar-request.dto';
import { GetSchedulesInCalendarResponseDto } from '../dtos/get-schedules-in-calendar-response.dto';
import { PostScheduleAlarmsPipe } from '../pipes/post-schedule-alarms.pipe';

@Controller(DomainNameEnum.SCHEDULE)
@UseInterceptors(ClassSerializerInterceptor)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * @summary 일정 생성하기 API
   * @author  Jason
   * @url     [POST] /api/v1/schedules
   * @returns { Promise<ResponseEntity<PostScheduleResponseDto>> }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postSchedule(
    @UserId() userId: number,
    @Body(PostScheduleAlarmsPipe) body: PostScheduleRequestDto,
  ): Promise<ResponseEntity<PostScheduleResponseDto>> {
    const result = await this.scheduleService.createSchedule(userId, body);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  /**
   * @summary 일정 삭제하기 API
   * @author  Jason
   * @url     [DELETE] /api/v1/schedules/:scheduleId
   */
  @Delete('/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<void> {
    await this.scheduleService.removeSchedule(schedule);
  }

  /**
   * @summary 일정 수정하기 API
   * @author  Jason
   * @url     [PUT] /api/v1/schedules/{scheduleId}
   */
  @Put('/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async putSchedule(
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
    @Body(PostScheduleAlarmsPipe) body: PutScheduleRequestDto,
  ): Promise<void> {
    await this.scheduleService.modifySchedule(schedule, body);
  }

  /**
   * @summary 특정 날짜의 일정 조회하기 API
   * @author Jason
   */
  @Get('detail-by-date')
  @HttpCode(HttpStatus.OK)
  async getSchedulesOnSpecificDate(
    @UserId() userId: number,
    @Query() query: GetScheduleOnSpecificDateRequestDto,
  ): Promise<ResponseEntity<GetScheduleOnSpecificDateResponseDto>> {
    const result = await this.scheduleService.findSchedulesOnSpecificDate(
      userId,
      query.date,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 특정 일정 조회하기 API
   * @author  Jason
   * @url     [GET] /api/v1/schedules/detail-by-id?scheduleId=
   */
  @Get('detail-by-id')
  @HttpCode(HttpStatus.OK)
  async getScheduleDetailById(
    @Query(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<ResponseEntity<GetScheduleDetailByIdResponseDto>> {
    const result = await this.scheduleService.findScheduleOnSpecificId(
      schedule,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 캘린더 조회 API
   * @author Jason
   */
  @Get('calendars')
  @HttpCode(HttpStatus.OK)
  async getSchedulesInCalendar(
    @UserId() userId: number,
    @Query() query: GetSchedulesInCalendarRequestDto,
  ): Promise<ResponseEntity<GetSchedulesInCalendarResponseDto>> {
    const result = await this.scheduleService.findSchedulesInCalendar(
      userId,
      query,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 특정 일정의 장소 조회하기 API
   * @author  Jason
   * @url     [GET] /api/v1/schedules/{scheduleId}/areas
   * @returns { Promise<ResponseEntity<GetScheduleAreasByIdResponseDto>> }
   */
  @Get('/:scheduleId/areas')
  @HttpCode(HttpStatus.OK)
  async getScheduleAreasById(
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<ResponseEntity<GetScheduleAreasByIdResponseDto>> {
    const result = await this.scheduleService.findScheduleAreasById(
      schedule.id,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }
}
