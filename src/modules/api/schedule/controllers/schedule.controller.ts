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
  Query,
} from '@nestjs/common';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { ResponseEntity } from 'src/common/response-entity';
import { ScheduleValidationPipe } from '../pipes/schedule-validation.pipe';
import { ScheduleDto } from '../dtos/schedule.dto';
import { PostScheduleResponseDto } from '../dtos/post-schedule-response.dto';
import { GetScheduleOnSpecificDateResponseDto } from '../dtos/get-schedule-on-specific-date-response.dto';
import { GetScheduleDetailByIdResponseDto } from '../dtos/get-schedule-detail-by-id-response.dto';

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
    @UserId() userId: number,
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<void> {
    await this.scheduleService.removeSchedule(userId, schedule.getId);
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
    const result = await this.scheduleService.findScheduleDetailById(schedule);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }
}
