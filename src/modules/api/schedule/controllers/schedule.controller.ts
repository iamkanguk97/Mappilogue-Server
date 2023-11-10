import { GetScheduleOnSpecificDateRequestDto } from './../dtos/get-schedule-on-specific-date-request.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  Put,
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  Query,
} from '@nestjs/common';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { ResponseEntity } from 'src/entities/common/response.entity';
import { ScheduleValidationPipe } from '../pipes/schedule-validation.pipe';
import { ScheduleDto } from '../dtos/schedule.dto';
import { PostScheduleResponseDto } from '../dtos/post-schedule-response.dto';
import { GetSchedulesInCalenderRequestDto } from '../dtos/get-schedules-in-calender-request.dto';
import { GetScheduleOnSpecificDateResponseDto } from '../dtos/get-schedule-on-specific-date-response.dto';
import { GetScheduleDetailByIdResponseDto } from '../dtos/get-schedule-detail-by-id-response.dto';
import { PutScheduleRequestDto } from '../dtos/put-schedule-request.dto';
import { GetSchedulesInCalenderResponseDto } from '../dtos/get-schedules-in-calender-response.dto';
import { GetScheduleAreasByIdResponseDto } from '../dtos/get-schedule-areas-by-id-response.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postSchedule(
    @UserId() userId: number,
    @Body() body: PostScheduleRequestDto,
  ): Promise<ResponseEntity<PostScheduleResponseDto>> {
    const result = await this.scheduleService.createSchedule(userId, body);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Delete('/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<void> {
    await this.scheduleService.removeSchedule(schedule);
  }

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

  @Get('calenders')
  @HttpCode(HttpStatus.OK)
  async getSchedulesInCalender(
    @UserId() userId: number,
    @Query() query: GetSchedulesInCalenderRequestDto,
  ): Promise<ResponseEntity<GetSchedulesInCalenderResponseDto>> {
    const result = await this.scheduleService.findSchedulesInCalender(
      userId,
      query,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Put('/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async putSchedule(
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
    @Body() body: PutScheduleRequestDto,
  ): Promise<void> {
    await this.scheduleService.modifySchedule(schedule, body);
  }

  @Get('/:scheduleId/areas')
  @HttpCode(HttpStatus.OK)
  async getScheduleAreasById(
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<ResponseEntity<GetScheduleAreasByIdResponseDto>> {
    const result = await this.scheduleService.findScheduleAreasById(
      schedule.getId,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Get('detail-by-id')
  @HttpCode(HttpStatus.OK)
  async getScheduleDetailById(
    @UserId() userId: number,
    @Query(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<ResponseEntity<any>> {
    const result = await this.scheduleService.findScheduleDetailById(
      userId,
      schedule,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Get('detail-by-id')
  @HttpCode(HttpStatus.OK)
  async getScheduleDetailById(
    @UserId() userId: number,
    @Query(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<ResponseEntity<any>> {
    const result = await this.scheduleService.findScheduleDetailById(
      userId,
      schedule,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }
}
